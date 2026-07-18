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
  shelter: {
    name: "Your Shelter",
    description: "A small room near the square. It is plain, dry, and quiet.\nSomeone has left a folded blanket on the narrow bed.",
    npcIds: [],
  },
  villageEdge: {
    name: "Village Edge",
    description: "The last cottages stand beside a wall of tangled growth.\nAn old path disappears beneath the trees.",
    npcIds: ["woodsman"],
  },
  mineEntrance: {
    name: "Old Mine Entrance",
    description: "Broken timbers and fallen stone cover the mine entrance.\nA small worker's hut stands beside the blocked tunnel.",
    npcIds: ["formerMiner"],
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
      this.renderWoodsmanActions();
      return;
    }

    if (gameState.currentTownPlace === "mineEntrance") {
      this.renderFormerMinerActions();
      return;
    }

    if (gameState.currentTownPlace === "townHall") {
      this.renderTownHallActions();
      return;
    }

    if (gameState.currentTownPlace === "shelter") {
      this.renderShelterActions();
      return;
    }

    let actionY = 270;
    createTextAction(this, columns.center, actionY, "Speak with the Village Guard", () => {
      this.message = this.getGuardMessage();
      this.renderTown();
    });
    actionY += 24;
    createTextAction(this, columns.center, actionY, "Return to your shelter", () => {
      gameState.currentTownPlace = "shelter";
      this.message = "You leave the square and return to the room offered to you.";
      this.renderTown();
    });
    actionY += 24;
    createTextAction(this, columns.center, actionY, "Step into the Town Hall", () => {
      gameState.currentTownPlace = "townHall";
      this.message = "You enter the old Town Hall.";
      this.renderTown();
    });
    actionY += 24;

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
    actionY += 24;
    createTextAction(this, columns.center, actionY, "Follow the road to the old mine", () => {
      gameState.currentTownPlace = "mineEntrance";
      this.message = "You follow the worn road toward the old mine.";
      this.renderTown();
    });
    actionY += 24;

    for (const locationId of gameState.discoveredLocations) {
      if (locationId === "town") {
        continue;
      }
      if (locationId === "forest" || locationId === "mine") {
        continue;
      }
      this.createTravelAction(locationId, actionY);
      actionY += 24;
    }

  }

  private renderTownHallActions(): void {
    createTextAction(this, columns.center, 280, "Speak with 👴 Village Chief", () => {
      this.message = this.getChiefMessage();
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

  private renderShelterActions(): void {
    createTextAction(this, columns.center, 282, "Sit quietly for a while", () => {
      this.message =
        "The room is still unfamiliar, but the sounds of the village carry through the window.";
      this.renderTown();
    });
    createTextAction(this, columns.center, 316, "Step outside to the Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You close the shelter door behind you and return to the square.";
      this.renderTown();
    });
  }

  private renderWoodsmanActions(): void {
    let actionY = 280;

    if (!gameState.knowledge.knowsForest) {
      createTextAction(this, columns.center, actionY, "Study the overgrown forest path", () => {
        gameState.knowledge.knowsForest = true;
        this.addKnownLocation("forest");
        this.message =
          "Beneath weeds and fallen branches, an old working path still leads into the forest.";
        this.renderTown();
      });
      actionY += 28;
    }

    createTextAction(this, columns.center, actionY, "Speak with 🪓 Old Woodsman", () => {
      gameState.villagePeople.woodsmanMet = true;
      this.message =
        'Old Woodsman: "That forest once kept every hearth warm. When the village weakened, the path was left to disappear. It still remembers the way, even if we do not."';
      this.renderTown();
    });
    actionY += 28;

    if (gameState.knowledge.knowsForest) {
      this.createTravelAction("forest", actionY);
      actionY += 28;
    }

    createTextAction(this, columns.center, actionY, "Walk back to the Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You return to the center of the village.";
      this.renderTown();
    });
  }

  private renderFormerMinerActions(): void {
    let actionY = 280;

    if (!gameState.knowledge.knowsMine) {
      createTextAction(this, columns.center, actionY, "Examine the abandoned mine", () => {
        gameState.knowledge.knowsMine = true;
        this.addKnownLocation("mine");
        this.message =
          "The main entrance has collapsed, but a narrow service passage remains between the stones.";
        this.renderTown();
      });
      actionY += 28;
    }

    createTextAction(this, columns.center, actionY, "Speak with ⛏ Former Miner", () => {
      gameState.villagePeople.formerMinerMet = true;
      this.message =
        'Former Miner: "Stone from these tunnels built half the village. After the collapse, there were too few of us to clear them. The old passages are still down there."';
      this.renderTown();
    });
    actionY += 28;

    if (gameState.knowledge.knowsMine) {
      this.createTravelAction("mine", actionY);
      actionY += 28;
    }

    createTextAction(this, columns.center, actionY, "Walk back to the Town Square", () => {
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

  private addKnownLocation(locationId: LocationId): void {
    if (!gameState.discoveredLocations.includes(locationId)) {
      gameState.discoveredLocations.push(locationId);
    }
  }

  private getNearbyPlaces(): string[] {
    if (gameState.currentTownPlace === "townHall") {
      return ["Town Square"];
    }
    if (gameState.currentTownPlace === "shelter") {
      return ["Town Square"];
    }
    if (gameState.currentTownPlace === "villageEdge") {
      return gameState.knowledge.knowsForest
        ? ["Town Square", "Forest"]
        : ["Town Square", "Overgrown path"];
    }
    if (gameState.currentTownPlace === "mineEntrance") {
      return gameState.knowledge.knowsMine
        ? ["Town Square", "Mine"]
        : ["Town Square", "Blocked tunnel"];
    }

    if (!gameState.knowledge.surveyedVillage) {
      return ["Your Shelter", "Town Hall"];
    }

    const knownPlaces = ["Your Shelter", "Town Hall", "Village Edge", "Old Mine Entrance"];
    if (gameState.discoveredLocations.includes("plains")) {
      knownPlaces.push("Plains");
    }
    if (gameState.discoveredLocations.includes("lake")) {
      knownPlaces.push("Lake");
    }
    return knownPlaces;
  }

  private getGuardMessage(): string {
    if (
      gameState.villagePeople.woodsmanMet ||
      gameState.villagePeople.formerMinerMet
    ) {
      return 'Village Guard: "You are finding your way around. Good. People have started to recognize you."';
    }
    return 'Village Guard: "Settling in? The room near the square should keep the rain out."';
  }

  private getChiefMessage(): string {
    if (gameState.town.level >= 2) {
      return 'Village Chief: "The restored hall has given everyone some hope. You helped make that possible."';
    }
    if (gameState.discoveredLocations.includes("deepForest")) {
      return 'Village Chief: "You have learned paths even some of us had forgotten. Willow Village is fortunate you stayed."';
    }
    if (
      gameState.villagePeople.woodsmanMet &&
      gameState.villagePeople.formerMinerMet
    ) {
      return 'Village Chief: "I hear you have spoken with those who remember the old forest and mine. You are beginning to understand what this village once was."';
    }
    return 'Village Chief: "I hope the room has been comfortable enough. You are welcome here while you find your place."';
  }
}
