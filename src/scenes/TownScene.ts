import Phaser from "phaser";

import { locations } from "../data/locations";
import type { Direction, LocationId } from "../types/game";

interface LocationButtonLayout {
  direction: Direction;
  x: number;
  y: number;
}

const buttonLayouts: LocationButtonLayout[] = [
  { direction: "north", x: 480, y: 105 },
  { direction: "west", x: 235, y: 270 },
  { direction: "east", x: 725, y: 270 },
  { direction: "south", x: 480, y: 435 },
];

export class TownScene extends Phaser.Scene {
  constructor() {
    super("town");
  }

  create(): void {
    this.drawFrame();

    this.add
      .text(480, 28, "TOWNLY", {
        color: "#e8d8b7",
        fontFamily: "Georgia, serif",
        fontSize: "20px",
        letterSpacing: 8,
      })
      .setOrigin(0.5, 0);

    const town = locations.town;
    this.createLocationCard(480, 270, town.id, false);

    for (const layout of buttonLayouts) {
      const destination = town.exits[layout.direction];
      if (destination) {
        this.createLocationCard(layout.x, layout.y, destination, true);
      }
    }

    this.add
      .text(480, 505, "Choose a road to leave town", {
        color: "#9eaa98",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
      })
      .setOrigin(0.5);
  }

  private drawFrame(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x6e7f68, 0.8);
    graphics.strokeRoundedRect(24, 20, 912, 500, 16);
    graphics.lineStyle(2, 0x65745f, 0.45);
    graphics.lineBetween(480, 180, 480, 214);
    graphics.lineBetween(345, 270, 384, 270);
    graphics.lineBetween(576, 270, 615, 270);
    graphics.lineBetween(480, 326, 480, 360);
  }

  private createLocationCard(
    x: number,
    y: number,
    locationId: LocationId,
    interactive: boolean,
  ): void {
    const location = locations[locationId];
    const width = interactive ? 220 : 192;
    const height = interactive ? 112 : 96;
    const card = this.add.graphics();

    card.fillStyle(location.color, interactive ? 0.25 : 0.38);
    card.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12);
    card.lineStyle(2, location.color, interactive ? 0.95 : 0.7);
    card.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 12);

    this.add
      .text(x, y - 15, `${location.symbol}  ${location.name}`, {
        color: "#f4ead6",
        fontFamily: "Georgia, serif",
        fontSize: interactive ? "25px" : "28px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 24, interactive ? "Click to travel" : "You are here", {
        color: interactive ? "#c5cfbc" : "#e2cda6",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
      })
      .setOrigin(0.5);

    if (!interactive) {
      return;
    }

    const hitArea = this.add
      .zone(x, y, width, height)
      .setInteractive({ useHandCursor: true });

    hitArea.on("pointerover", () => card.setAlpha(1.45));
    hitArea.on("pointerout", () => card.setAlpha(1));
    hitArea.on("pointerdown", () => {
      this.scene.start("explore", { locationId });
    });
  }
}
