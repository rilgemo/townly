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
  private message = "You take in your surroundings.";
  private explorationActive = false;

  constructor() {
    super("explore");
  }

  init(data: ExploreSceneData): void {
    this.locationId = data.locationId;
    this.message = "You take in your surroundings.";
    this.explorationActive = false;
  }

  create(): void {
    this.renderPlace();
  }

  private renderPlace(): void {
    this.children.removeAll();
    const location = locations[this.locationId];
    renderLayout(this, {
      nearbyPlaces: this.getNearbyPlaces(),
    });

    this.add.text(columns.center, 60, `${location.symbol} ${location.name}`, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "29px",
    });
    this.add.text(columns.center, 102, location.description, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "15px",
    });

    this.renderActions();

    this.add.text(columns.center, 408, this.message, {
      color: this.explorationActive ? colors.secondary : colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
      lineSpacing: 5,
    });
  }

  private renderActions(): void {
    const exploration = getExploration(this.locationId);

    if (this.locationId === "deepForest") {
      createTextAction(this, columns.center, 228, "Follow the hidden path back to the forest", () => {
        this.scene.start("explore", { locationId: "forest" });
      });
      return;
    }

    if (exploration) {
      const reward = this.formatRewardPreview(exploration.reward);
      createTextAction(
        this,
        columns.center,
        228,
        this.explorationActive
          ? "Searching..."
          : `${this.getSearchAction()} (${exploration.durationSeconds}s, ${reward})`,
        () => this.beginExploration(exploration),
        !this.explorationActive,
      );
    }

    let returnY = 270;
    if (
      this.locationId === "forest" &&
      gameState.discoveredLocations.includes("deepForest")
    ) {
      createTextAction(this, columns.center, 270, "Follow the hidden path deeper", () => {
        this.scene.start("explore", { locationId: "deepForest" });
      });
      returnY = 304;
    }

    const returnLabel =
      this.locationId === "forest"
        ? "Follow the path south to the village edge"
        : this.locationId === "mine"
          ? "Leave the passage and walk west"
          : "Walk back toward Willow Village";
    createTextAction(this, columns.center, returnY, returnLabel, () => {
      this.scene.start("town");
    });
  }

  private beginExploration(exploration: Exploration): void {
    this.explorationActive = true;
    let secondsRemaining = exploration.durationSeconds;
    this.message = `Searching... ${secondsRemaining}s remaining`;
    this.renderPlace();

    this.time.addEvent({
      delay: 1000,
      repeat: exploration.durationSeconds - 1,
      callback: () => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          this.message = `Searching... ${secondsRemaining}s remaining`;
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
        `The hidden path now feels familiar: ${locations[discoveredLocation].name}`,
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

  private getSearchAction(): string {
    if (this.locationId === "forest") {
      return "Search beneath the trees";
    }
    if (this.locationId === "mine") {
      return "Search the side passage";
    }
    return "Search the area";
  }
}
