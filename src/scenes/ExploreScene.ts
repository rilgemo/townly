import Phaser from "phaser";

import { locations } from "../data/locations";
import { resources } from "../data/resources";
import { gameState } from "../state/GameState";
import {
  completeExploration,
  getExploration,
  type Exploration,
} from "../systems/ExplorationSystem";
import type { LocationId, ResourceId, ResourceReward } from "../types/game";
import {
  addSectionTitle,
  columns,
  createTextAction,
  renderLayout,
} from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface ExploreSceneData {
  locationId: LocationId;
}

export class ExploreScene extends Phaser.Scene {
  private locationId: LocationId = "forest";
  private message = "Choose an action.";
  private explorationActive = false;

  constructor() {
    super("explore");
  }

  init(data: ExploreSceneData): void {
    this.locationId = data.locationId;
    this.message = "Choose an action.";
    this.explorationActive = false;
  }

  create(): void {
    this.renderPlace();
  }

  private renderPlace(): void {
    this.children.removeAll();
    const location = locations[this.locationId];
    renderLayout(this, "Surrounding Wilds", location.name, {
      nearbyPlaces: this.getNearbyPlaces(),
    });

    addSectionTitle(this, columns.center, 32, "Current Place");
    this.add.text(columns.center, 60, `${location.symbol} ${location.name}`, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "25px",
    });
    this.add.text(columns.center, 102, location.description, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    addSectionTitle(this, columns.center, 166, "NPCs");
    this.add.text(columns.center, 192, "No one is nearby.", {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "13px",
    });

    addSectionTitle(this, columns.center, 236, "Available Actions");
    this.renderActions();

    addSectionTitle(this, columns.center, 390, "Recent");
    this.add.text(columns.center, 416, this.message, {
      color: this.explorationActive ? colors.secondary : colors.success,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
      lineSpacing: 5,
    });
  }

  private renderActions(): void {
    const exploration = getExploration(this.locationId);

    if (exploration) {
      const reward = this.formatRewardPreview(exploration.reward);
      createTextAction(
        this,
        columns.center,
        266,
        this.explorationActive
          ? "Exploration in progress"
          : `Explore (${exploration.durationSeconds}s → ${reward})`,
        () => this.beginExploration(exploration),
        !this.explorationActive,
      );
    } else {
      createTextAction(
        this,
        columns.center,
        266,
        "Nothing has been discovered here yet",
        () => undefined,
        false,
      );
    }

    createTextAction(this, columns.center, 300, "Return to Town", () => {
      this.scene.start("town");
    });
  }

  private beginExploration(exploration: Exploration): void {
    this.explorationActive = true;
    let secondsRemaining = exploration.durationSeconds;
    this.message = `Exploring... ${secondsRemaining}s remaining`;
    this.renderPlace();

    this.time.addEvent({
      delay: 1000,
      repeat: exploration.durationSeconds - 1,
      callback: () => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          this.message = `Exploring... ${secondsRemaining}s remaining`;
          this.renderPlace();
          return;
        }

        const result = completeExploration(this.locationId, exploration);
        this.explorationActive = false;
        this.message = this.formatExplorationResult(
          result.reward,
          result.discoveredLocation,
        );
        this.renderPlace();
      },
    });
  }

  private formatExplorationResult(
    reward: ResourceReward,
    discoveredLocation?: LocationId,
  ): string {
    const lines = [`Obtained ${this.formatReward(reward)}.`];
    if (discoveredLocation) {
      lines.push(
        "You discovered a hidden path.",
        `New location unlocked: ${locations[discoveredLocation].name}`,
      );
    }
    return lines.join("\n");
  }

  private formatReward(reward: ResourceReward): string {
    return Object.entries(reward)
      .map(
        ([resourceId, amount]) =>
          `${amount} ${resources[resourceId as ResourceId].name}`,
      )
      .join(", ");
  }

  private formatRewardPreview(reward: ResourceReward): string {
    const knownRewards = Object.entries(reward).filter(([resourceId]) => {
      if (resourceId === "wood") {
        return gameState.knowledge.knowsWood;
      }
      if (resourceId === "stone") {
        return gameState.knowledge.knowsStone;
      }
      return gameState.knowledge.knowsHerb;
    });

    if (knownRewards.length === 0) {
      return "unknown result";
    }

    const knownText = this.formatReward(Object.fromEntries(knownRewards));
    return knownRewards.length < Object.keys(reward).length
      ? `${knownText}, something unknown`
      : knownText;
  }

  private getNearbyPlaces(): string[] {
    const nearby = ["Townly"];
    if (
      this.locationId === "forest" &&
      gameState.discoveredLocations.includes("deepForest")
    ) {
      nearby.push("Deep Forest");
    }
    return nearby;
  }
}
