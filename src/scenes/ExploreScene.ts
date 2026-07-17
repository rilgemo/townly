import Phaser from "phaser";

import { locations } from "../data/locations";
import { resources } from "../data/resources";
import {
  completeExploration,
  getExploration,
  type Exploration,
} from "../systems/ExplorationSystem";
import type { LocationId, ResourceId, ResourceReward } from "../types/game";
import { addDivider, colors, fonts } from "../ui/theme";

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
    this.cameras.main.setBackgroundColor(colors.background);

    this.add.text(70, 35, location.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "34px",
    });
    this.add.text(890, 48, "LOCATION", {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    }).setOrigin(1, 0);
    addDivider(this, 82);

    this.add.text(70, 112, location.description, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "15px",
    });

    const exploration = getExploration(this.locationId);
    if (exploration) {
      this.createExplorationSection(exploration);
    } else {
      this.createEmptySection();
    }

    addDivider(this, 428);
    const returnAction = this.add.text(70, 462, "< Return to Town", {
      color: colors.action,
      fontFamily: fonts.body,
      fontSize: "15px",
    }).setInteractive({ useHandCursor: true });
    returnAction.on("pointerover", () => returnAction.setColor(colors.primary));
    returnAction.on("pointerout", () => returnAction.setColor(colors.action));
    returnAction.on("pointerdown", () => this.scene.start("town"));
  }

  private createExplorationSection(exploration: Exploration): void {
    addDivider(this, 168);
    this.add.text(70, 194, "EXPLORATION", {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });

    const rewardPreview = this.formatReward(exploration.reward);
    this.add.text(70, 230, `Duration    ${exploration.durationSeconds} seconds`, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "14px",
    });
    this.add.text(70, 258, `Find        ${rewardPreview}`, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "14px",
    });

    const status = this.add.text(70, 342, "Ready.", {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "13px",
    });
    const action = this.add.text(70, 302, "[ Explore ]", {
      color: colors.action,
      fontFamily: fonts.body,
      fontSize: "16px",
    }).setInteractive({ useHandCursor: true });

    action.on("pointerover", () => action.setColor(colors.primary));
    action.on("pointerout", () => action.setColor(colors.action));
    action.once("pointerdown", () => {
      action.disableInteractive().setColor(colors.disabled);
      this.beginExploration(exploration, action, status);
    });
  }

  private createEmptySection(): void {
    addDivider(this, 168);
    this.add.text(70, 194, "EXPLORATION", {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });
    this.add.text(70, 238, "Nothing has been discovered here yet.", {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "14px",
      fontStyle: "italic",
    });
  }

  private beginExploration(
    exploration: Exploration,
    action: Phaser.GameObjects.Text,
    status: Phaser.GameObjects.Text,
  ): void {
    let secondsRemaining = exploration.durationSeconds;
    action.setText("[ Exploring ]");
    status.setColor(colors.secondary).setText(`Progress    ${secondsRemaining}s remaining`);

    this.time.addEvent({
      delay: 1000,
      repeat: exploration.durationSeconds - 1,
      callback: () => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          status.setText(`Progress    ${secondsRemaining}s remaining`);
          return;
        }

        const reward = completeExploration(exploration);
        action.setText("[ Complete ]").setColor(colors.success);
        status.setColor(colors.success).setText(`Obtained    ${this.formatReward(reward)}`);
      },
    });
  }

  private formatReward(reward: ResourceReward): string {
    return Object.entries(reward)
      .map(([resourceId, amount]) => `${amount} ${resources[resourceId as ResourceId].name}`)
      .join("  ·  ");
  }
}
