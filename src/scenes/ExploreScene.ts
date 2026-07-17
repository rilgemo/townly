import Phaser from "phaser";

import { locations } from "../data/locations";
import { resources } from "../data/resources";
import {
  completeExploration,
  getExploration,
  type Exploration,
} from "../systems/ExplorationSystem";
import type { LocationId, ResourceId, ResourceReward } from "../types/game";

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
    graphics.fillRoundedRect(340, 458, 280, 52, 12);
    graphics.lineStyle(2, 0xc8945d, 0.9);
    graphics.strokeRoundedRect(340, 458, 280, 52, 12);

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

    const exploration = getExploration(this.locationId);
    if (exploration) {
      this.createExploreAction(exploration);
    } else {
      this.add
        .text(480, 382, "There is nothing to gather here yet.", {
          color: "#899586",
          fontFamily: "Arial, sans-serif",
          fontSize: "15px",
          fontStyle: "italic",
        })
        .setOrigin(0.5);
    }

    const returnButton = this.add
      .zone(480, 484, 280, 52)
      .setInteractive({ useHandCursor: true });
    const returnLabel = this.add
      .text(480, 484, "←  Return to Town", {
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

  private createExploreAction(exploration: Exploration): void {
    const actionBackground = this.add.graphics();
    actionBackground.fillStyle(0x111712, 0.86);
    actionBackground.fillRoundedRect(340, 372, 280, 64, 12);
    actionBackground.lineStyle(2, locations[this.locationId].color, 0.9);
    actionBackground.strokeRoundedRect(340, 372, 280, 64, 12);

    const actionLabel = this.add
      .text(480, 404, `Explore  ·  ${exploration.durationSeconds}s`, {
        color: "#f0ddba",
        fontFamily: "Georgia, serif",
        fontSize: "21px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const actionButton = this.add
      .zone(480, 404, 280, 64)
      .setInteractive({ useHandCursor: true });

    actionButton.on("pointerover", () => actionLabel.setColor("#ffffff"));
    actionButton.on("pointerout", () => actionLabel.setColor("#f0ddba"));
    actionButton.once("pointerdown", () => {
      actionButton.disableInteractive();
      this.beginExploration(exploration, actionLabel);
    });
  }

  private beginExploration(
    exploration: Exploration,
    actionLabel: Phaser.GameObjects.Text,
  ): void {
    let secondsRemaining = exploration.durationSeconds;
    actionLabel.setText(`Exploring... ${secondsRemaining}s`);

    this.time.addEvent({
      delay: 1000,
      repeat: exploration.durationSeconds - 1,
      callback: () => {
        secondsRemaining -= 1;

        if (secondsRemaining > 0) {
          actionLabel.setText(`Exploring... ${secondsRemaining}s`);
          return;
        }

        const reward = completeExploration(exploration);
        actionLabel.setText("Exploration complete");
        this.showReward(reward);
      },
    });
  }

  private showReward(reward: ResourceReward): void {
    const rewardText = Object.entries(reward)
      .map(([resourceId, amount]) => {
        const resource = resources[resourceId as ResourceId];
        return `+${amount} ${resource.name}`;
      })
      .join("   ");

    this.add
      .text(480, 446, rewardText, {
        color: "#b9dc9d",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }
}
