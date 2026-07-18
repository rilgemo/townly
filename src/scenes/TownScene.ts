import Phaser from "phaser";

import { locations } from "../data/locations";
import { npcs, type NpcId } from "../data/npcs";
import { gameState } from "../state/GameState";
import {
  canUpgradeTownHall,
  townHallUpgradeCost,
  upgradeTownHall,
} from "../systems/TownUpgradeSystem";
import type { LocationId } from "../types/game";
import {
  columns,
  createTextAction,
  renderLayout,
} from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface TownPlace {
  name: string;
  description: string;
  npcIds: NpcId[];
}

const townPlaces: Record<typeof gameState.currentTownPlace, TownPlace> = {
  townSquare: {
    name: "Town Square",
    description: "A small settlement slowly comes alive. Paths lead toward\nthe village edge and the old mine road.",
    npcIds: ["guard"],
  },
  townHall: {
    name: "Town Hall",
    description: "The hall contains the village records and a long communal table.\nIts worn structure reflects the condition of the town.",
    npcIds: ["chief"],
  },
  villageEdge: {
    name: "Village Edge",
    description: "The last cottages stand beside a wall of tangled growth.\nAn old path disappears beneath the trees.",
    npcIds: ["lumberjack"],
  },
  mineEntrance: {
    name: "Old Mine Entrance",
    description: "Broken timbers and fallen stone cover the mine entrance.\nA small worker's hut stands beside the blocked tunnel.",
    npcIds: ["miner"],
  },
};

export class TownScene extends Phaser.Scene {
  private message = "The town waits for your next decision.";

  constructor() {
    super("town");
  }

  create(): void {
    this.renderTown();
  }

  private renderTown(): void {
    this.children.removeAll();
    const place = townPlaces[gameState.currentTownPlace];
    renderLayout(this, {
      nearbyPlaces: this.getNearbyPlaces(),
    });

    this.add.text(columns.center, 60, place.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "29px",
    });
    const placeDescription =
      gameState.currentTownPlace === "townHall"
        ? `${place.description}\nCondition: ${gameState.town.level >= 2 ? "Restored" : "Worn"}`
        : place.description;
    this.add.text(columns.center, 102, placeDescription, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "15px",
      lineSpacing: 10,
    });

    place.npcIds.forEach((npcId, index) => {
      const npc = npcs[npcId];
      this.add.text(columns.center, 210 + index * 36, `${npc.icon} ${npc.name}`, {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "13px",
      });
      this.add.text(columns.center + 158, 210 + index * 36, npc.description, {
        color: colors.muted,
        fontFamily: fonts.body,
        fontSize: "11px",
      });
    });

    this.renderActions();

    this.add.text(columns.center, 474, this.message, {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
    });
  }

  private renderActions(): void {
    if (gameState.currentTownPlace === "villageEdge") {
      this.renderLumberjackActions();
      return;
    }

    if (gameState.currentTownPlace === "mineEntrance") {
      this.renderMinerActions();
      return;
    }

    if (gameState.currentTownPlace === "townHall") {
      this.renderTownHallActions();
      return;
    }

    let actionY = 282;
    createTextAction(this, columns.center, actionY, "Step into the Town Hall", () => {
      gameState.currentTownPlace = "townHall";
      this.message = "You enter the old Town Hall.";
      this.renderTown();
    });
    actionY += 26;

    if (!gameState.knowledge.surveyedVillage) {
      createTextAction(this, columns.center, actionY, "Look around Town Square", () => {
        gameState.knowledge.surveyedVillage = true;
        this.message =
          "You notice cottages near the village edge and an old road leading toward a blocked mine.";
        this.renderTown();
      });
      return;
    }

    createTextAction(this, columns.center, actionY, "Walk to the village edge", () => {
      gameState.currentTownPlace = "villageEdge";
      this.message = "You walk toward the cottages at the village edge.";
      this.renderTown();
    });
    actionY += 26;
    createTextAction(this, columns.center, actionY, "Follow the road to the old mine", () => {
      gameState.currentTownPlace = "mineEntrance";
      this.message = "You follow the worn road toward the old mine.";
      this.renderTown();
    });
    actionY += 26;

    for (const locationId of gameState.discoveredLocations) {
      if (locationId === "town") {
        continue;
      }
      this.createTravelAction(locationId, actionY);
      actionY += 26;
    }

  }

  private renderTownHallActions(): void {
    createTextAction(this, columns.center, 280, "Speak with 👴 Village Chief", () => {
      this.message =
        gameState.town.level >= 2
          ? 'Village Chief: "The restored hall has given everyone some hope."'
          : 'Village Chief: "The hall can be repaired, if the village gathers enough material."';
      this.renderTown();
    });

    if (gameState.town.level === 1) {
      const woodCost = townHallUpgradeCost.wood ?? 0;
      const stoneCost = townHallUpgradeCost.stone ?? 0;
      const affordable = canUpgradeTownHall();
      const knowsRequirements =
        gameState.knowledge.knowsWood && gameState.knowledge.knowsStone;
      createTextAction(
        this,
        columns.center,
        312,
        !knowsRequirements
          ? "Repair requirements are not understood yet"
          : affordable
          ? `Repair Town Hall (${woodCost} Wood, ${stoneCost} Stone)`
          : `Town Hall repair requires ${woodCost} Wood, ${stoneCost} Stone`,
        () => {
          if (upgradeTownHall()) {
            this.message = "The Town Hall has been restored. Town Level increased.";
            this.renderTown();
          }
        },
        knowsRequirements && affordable,
      );
    }

    createTextAction(this, columns.center, 350, "Step outside to the Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You step back into the Town Square.";
      this.renderTown();
    });
  }

  private renderLumberjackActions(): void {
    if (!gameState.villagePeople.lumberjackMet) {
      createTextAction(this, columns.center, 280, "Speak with 🪓 Lumberjack", () => {
        gameState.villagePeople.lumberjackMet = true;
        gameState.knowledge.knowsForest = true;
        this.unlockLocation("forest");
        this.message =
          'Lumberjack: "The forest path is badly overgrown. I cleared enough for you to pass." Forest unlocked.';
        this.renderTown();
      });
    } else {
      createTextAction(this, columns.center, 280, "Speak with 🪓 Lumberjack", () => {
        this.message =
          'Lumberjack: "The path is open. You should find useful material beneath the trees."';
        this.renderTown();
      });
      this.createTravelAction("forest", 306);
    }

    createTextAction(this, columns.center, 340, "Walk back to the Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You return to the center of the village.";
      this.renderTown();
    });
  }

  private renderMinerActions(): void {
    if (!gameState.villagePeople.minerMet) {
      createTextAction(this, columns.center, 280, "Speak with ⛏ Miner", () => {
        gameState.villagePeople.minerMet = true;
        gameState.knowledge.knowsMine = true;
        this.unlockLocation("mine");
        this.message =
          'Miner: "The main entrance is blocked, but I opened a narrow side passage." Mine unlocked.';
        this.renderTown();
      });
    } else {
      createTextAction(this, columns.center, 280, "Speak with ⛏ Miner", () => {
        this.message =
          'Miner: "The side passage is stable enough. There may be useful material inside."';
        this.renderTown();
      });
      this.createTravelAction("mine", 306);
    }

    createTextAction(this, columns.center, 340, "Walk back to the Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You return to the center of the village.";
      this.renderTown();
    });
  }

  private createTravelAction(locationId: LocationId, y: number): void {
    const location = locations[locationId];
    createTextAction(
      this,
      columns.center,
      y,
      `Head toward ${location.symbol} ${location.name}`,
      () => this.scene.start("explore", { locationId }),
    );
  }

  private unlockLocation(locationId: LocationId): void {
    if (!gameState.discoveredLocations.includes(locationId)) {
      gameState.discoveredLocations.push(locationId);
    }
  }

  private getNearbyPlaces(): string[] {
    if (gameState.currentTownPlace === "townHall") {
      return ["Town Square"];
    }
    if (gameState.currentTownPlace === "villageEdge") {
      return gameState.villagePeople.lumberjackMet
        ? ["Town Square", "Forest"]
        : ["Town Square", "Overgrown path"];
    }
    if (gameState.currentTownPlace === "mineEntrance") {
      return gameState.villagePeople.minerMet
        ? ["Town Square", "Mine"]
        : ["Town Square", "Blocked tunnel"];
    }

    if (!gameState.knowledge.surveyedVillage) {
      return ["Town Hall"];
    }

    const knownPlaces = ["Town Hall", "Village Edge", "Old Mine Entrance"];
    if (gameState.discoveredLocations.includes("plains")) {
      knownPlaces.push("Plains");
    }
    if (gameState.discoveredLocations.includes("lake")) {
      knownPlaces.push("Lake");
    }
    return knownPlaces;
  }
}
