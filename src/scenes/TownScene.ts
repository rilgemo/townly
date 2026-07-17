import Phaser from "phaser";

import { locations } from "../data/locations";
import { resourceIds, resources } from "../data/resources";
import { gameState } from "../state/GameState";
import { getResourceAmount } from "../systems/ResourceSystem";
import {
  canUpgradeTownHall,
  townHallUpgradeCost,
  upgradeTownHall,
} from "../systems/TownUpgradeSystem";
import type { Direction, LocationId } from "../types/game";
import { addDivider, colors, fonts } from "../ui/theme";

const directions: Direction[] = ["north", "west", "east", "south"];

export class TownScene extends Phaser.Scene {
  constructor() {
    super("town");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(colors.background);

    this.add.text(70, 35, "🏠  Townly", {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "34px",
    });
    this.add.text(890, 48, `TOWN  ·  LEVEL ${gameState.town.level}`, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    }).setOrigin(1, 0);
    addDivider(this, 82);

    this.add.text(70, 108, "A small settlement slowly comes alive.", {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "15px",
    });

    this.createResourceSection();
    this.createLocationSection();
    this.createTownHallSection();
  }

  private createResourceSection(): void {
    this.add.text(70, 150, "RESOURCES", {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });
    this.add.text(220, 150, `${gameState.player.name}  ·  Level ${gameState.player.level}`, {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
    });

    resourceIds.forEach((resourceId, index) => {
      const resource = resources[resourceId];
      this.add.text(70 + index * 160, 178, `${resource.symbol}  ${resource.name}`, {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "14px",
      });
      this.add.text(174 + index * 160, 178, String(getResourceAmount(resourceId)), {
        color: colors.primary,
        fontFamily: fonts.body,
        fontSize: "14px",
        fontStyle: "bold",
      });
    });
  }

  private createLocationSection(): void {
    addDivider(this, 215, 70, 500);
    this.add.text(70, 240, "EXPLORE", {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });

    const town = locations.town;
    directions.forEach((direction, index) => {
      const destination = town.exits[direction];
      if (destination) {
        this.createLocationEntry(destination, 276 + index * 52);
      }
    });
  }

  private createLocationEntry(locationId: LocationId, y: number): void {
    const location = locations[locationId];
    const title = this.add.text(70, y, `> ${location.symbol}  ${location.name}`, {
      color: colors.action,
      fontFamily: fonts.body,
      fontSize: "16px",
    }).setInteractive({ useHandCursor: true });

    this.add.text(238, y + 2, location.description, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    title.on("pointerover", () => title.setColor(colors.primary));
    title.on("pointerout", () => title.setColor(colors.action));
    title.on("pointerdown", () => this.scene.start("explore", { locationId }));
  }

  private createTownHallSection(): void {
    addDivider(this, 215, 610, 280);
    this.add.text(610, 240, "🏠  TOWN HALL", {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });
    this.add.text(610, 276, `Level ${gameState.town.level}`, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "23px",
    });

    if (gameState.town.level >= 2) {
      this.add.text(610, 318, "The old hall is restored.\nThe town feels a little more alive.", {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "13px",
        lineSpacing: 8,
      });
      this.add.text(610, 390, "REPAIR COMPLETED", {
        color: colors.success,
        fontFamily: fonts.body,
        fontSize: "12px",
        fontStyle: "bold",
      });
      return;
    }

    this.add.text(610, 318, "The old hall needs repair.", {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    const woodCost = townHallUpgradeCost.wood ?? 0;
    const stoneCost = townHallUpgradeCost.stone ?? 0;
    this.add.text(610, 351, `${woodCost} Wood  ·  ${stoneCost} Stone`, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    const affordable = canUpgradeTownHall();
    const action = this.add.text(610, 394, affordable ? "[ Repair Town Hall ]" : "[ Resources required ]", {
      color: affordable ? colors.action : colors.disabled,
      fontFamily: fonts.body,
      fontSize: "14px",
    });

    if (!affordable) {
      return;
    }

    action.setInteractive({ useHandCursor: true });
    action.on("pointerover", () => action.setColor(colors.primary));
    action.on("pointerout", () => action.setColor(colors.action));
    action.once("pointerdown", () => {
      if (upgradeTownHall()) {
        this.scene.restart();
      }
    });
  }
}
