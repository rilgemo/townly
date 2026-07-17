import Phaser from "phaser";

import { locations } from "../data/locations";
import type { LocationId } from "../types/game";

interface ExploreSceneData {
  locationId: LocationId;
}

export class ExploreScene extends Phaser.Scene {
  private locationId: LocationId = "forest";

  constructor() {
    super("explore");
  }

  init(data: ExploreSceneData): void {
    this.locationId = data.locationId;
  }

  create(): void {
    const location = locations[this.locationId];
    const graphics = this.add.graphics();

    graphics.fillStyle(location.color, 0.18);
    graphics.fillCircle(480, 235, 145);
    graphics.lineStyle(3, location.color, 0.9);
    graphics.strokeCircle(480, 235, 145);
    graphics.fillStyle(0x111712, 0.72);
    graphics.fillRoundedRect(340, 405, 280, 64, 12);
    graphics.lineStyle(2, 0xc8945d, 0.9);
    graphics.strokeRoundedRect(340, 405, 280, 64, 12);

    this.add
      .text(480, 185, location.symbol, {
        color: "#f2e7cf",
        fontFamily: "Georgia, serif",
        fontSize: "72px",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 275, location.name, {
        color: "#f2e7cf",
        fontFamily: "Georgia, serif",
        fontSize: "40px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 330, location.description, {
        align: "center",
        color: "#bdc8b8",
        fontFamily: "Arial, sans-serif",
        fontSize: "17px",
        wordWrap: { width: 520 },
      })
      .setOrigin(0.5);

    const returnButton = this.add
      .zone(480, 437, 280, 64)
      .setInteractive({ useHandCursor: true });
    const returnLabel = this.add
      .text(480, 437, "←  Return to Town", {
        color: "#f0ddba",
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    returnButton.on("pointerover", () => returnLabel.setColor("#ffffff"));
    returnButton.on("pointerout", () => returnLabel.setColor("#f0ddba"));
    returnButton.on("pointerdown", () => this.scene.start("town"));
  }
}
