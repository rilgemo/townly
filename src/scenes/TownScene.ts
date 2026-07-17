import Phaser from "phaser";

import { locations } from "../data/locations";
import { gameState } from "../state/GameState";
import {
  canUpgradeTownHall,
  townHallUpgradeCost,
  upgradeTownHall,
} from "../systems/TownUpgradeSystem";
import {
  addSectionTitle,
  columns,
  createTextAction,
  renderLayout,
} from "../ui/layout";
import { colors, fonts } from "../ui/theme";

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
    renderLayout(this, "Townly", "Town Square");

    addSectionTitle(this, columns.center, 32, "Current Place");
    this.add.text(columns.center, 60, "Town Square", {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "25px",
    });
    this.add.text(
      columns.center,
      102,
      "A small settlement slowly comes alive. Roads lead toward\nthe surrounding forest, mine, plains, and lake.",
      {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "13px",
        lineSpacing: 7,
      },
    );

    addSectionTitle(this, columns.center, 166, "NPCs");
    this.add.text(columns.center, 192, "🛡 Village Guard    👴 Village Chief", {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    addSectionTitle(this, columns.center, 236, "Available Actions");
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
    let actionY = 266;

    for (const locationId of gameState.discoveredLocations) {
      if (locationId === "town") {
        continue;
      }

      const location = locations[locationId];
      createTextAction(
        this,
        columns.center,
        actionY,
        `Travel to ${location.symbol} ${location.name}`,
        () => this.scene.start("explore", { locationId }),
      );
      actionY += 28;
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
}
