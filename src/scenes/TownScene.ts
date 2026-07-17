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
  addSectionTitle,
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
    npcIds: ["guard", "chief"],
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
    renderLayout(this, "Townly", place.name);

    addSectionTitle(this, columns.center, 32, "Current Place");
    this.add.text(columns.center, 60, place.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "25px",
    });
    this.add.text(columns.center, 102, place.description, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
      lineSpacing: 7,
    });

    addSectionTitle(this, columns.center, 166, "NPCs");
    place.npcIds.forEach((npcId, index) => {
      const npc = npcs[npcId];
      this.add.text(columns.center, 192 + index * 24, `${npc.icon} ${npc.name}`, {
        color: colors.primary,
        fontFamily: fonts.body,
        fontSize: "13px",
      });
      this.add.text(columns.center + 158, 192 + index * 24, npc.description, {
        color: colors.muted,
        fontFamily: fonts.body,
        fontSize: "11px",
      });
    });

    addSectionTitle(this, columns.center, 252, "Available Actions");
    this.renderActions();

    addSectionTitle(this, columns.center, 454, "Recent");
    this.add.text(columns.center, 478, this.message, {
      color: colors.secondary,
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

    let actionY = 280;
    createTextAction(this, columns.center, actionY, "Visit Village Edge", () => {
      gameState.currentTownPlace = "villageEdge";
      this.message = "You walk toward the cottages at the village edge.";
      this.renderTown();
    });
    actionY += 26;
    createTextAction(this, columns.center, actionY, "Visit Old Mine Entrance", () => {
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

    if (gameState.town.level === 1) {
      const woodCost = townHallUpgradeCost.wood ?? 0;
      const stoneCost = townHallUpgradeCost.stone ?? 0;
      const affordable = canUpgradeTownHall();
      createTextAction(
        this,
        columns.center,
        actionY,
        affordable
          ? `Repair Town Hall (${woodCost} Wood, ${stoneCost} Stone)`
          : `Town Hall repair requires ${woodCost} Wood, ${stoneCost} Stone`,
        () => {
          if (upgradeTownHall()) {
            this.message = "The Town Hall has been restored. Town Level increased.";
            this.renderTown();
          }
        },
        affordable,
      );
    }
  }

  private renderLumberjackActions(): void {
    if (!gameState.villagePeople.lumberjackMet) {
      createTextAction(this, columns.center, 280, "Speak with 🪓 Lumberjack", () => {
        gameState.villagePeople.lumberjackMet = true;
        this.unlockLocation("forest");
        this.message =
          'Lumberjack: "The forest path is badly overgrown. I cleared enough for you to pass." Forest unlocked.';
        this.renderTown();
      });
    } else {
      createTextAction(this, columns.center, 280, "Speak with 🪓 Lumberjack", () => {
        this.message =
          'Lumberjack: "The path is open. The forest should provide wood and useful herbs."';
        this.renderTown();
      });
      this.createTravelAction("forest", 306);
    }

    createTextAction(this, columns.center, 340, "Return to Town Square", () => {
      gameState.currentTownPlace = "townSquare";
      this.message = "You return to the center of the village.";
      this.renderTown();
    });
  }

  private renderMinerActions(): void {
    if (!gameState.villagePeople.minerMet) {
      createTextAction(this, columns.center, 280, "Speak with ⛏ Miner", () => {
        gameState.villagePeople.minerMet = true;
        this.unlockLocation("mine");
        this.message =
          'Miner: "The main entrance is blocked, but I opened a narrow side passage." Mine unlocked.';
        this.renderTown();
      });
    } else {
      createTextAction(this, columns.center, 280, "Speak with ⛏ Miner", () => {
        this.message =
          'Miner: "The side passage is stable enough. You should find stone inside."';
        this.renderTown();
      });
      this.createTravelAction("mine", 306);
    }

    createTextAction(this, columns.center, 340, "Return to Town Square", () => {
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
      `Travel to ${location.symbol} ${location.name}`,
      () => this.scene.start("explore", { locationId }),
    );
  }

  private unlockLocation(locationId: LocationId): void {
    if (!gameState.discoveredLocations.includes(locationId)) {
      gameState.discoveredLocations.push(locationId);
    }
  }
}
