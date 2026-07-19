import Phaser from "phaser";

import { locations } from "../data/locations";
import { resources } from "../data/resources";
import { gameState } from "../state/GameState";
import {
  completePlaceAction,
  getPlaceActions,
  type PlaceAction,
  type PlaceActionResult,
} from "../systems/ExplorationSystem";
import type { LocationId, ResourceAmounts, ResourceId } from "../types/game";
import { columns, createTextAction, renderLayout } from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface ExploreSceneData {
  locationId: LocationId;
}

export class ExploreScene extends Phaser.Scene {
  private locationId: LocationId = "forest";
  private message = "You take in your surroundings.";
  private activeActionId?: string;

  constructor() {
    super("explore");
  }

  init(data: ExploreSceneData): void {
    this.locationId = data.locationId;
    this.message = "You take in your surroundings.";
    this.activeActionId = undefined;
  }

  create(): void {
    this.renderPlace();
  }

  private renderPlace(): void {
    this.children.removeAll();
    const location = locations[this.locationId];
    renderLayout(this, { nearbyPlaces: this.getNearbyPlaces() });

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

    this.renderChoices();

    this.add.text(columns.center, 408, this.message, {
      color: this.activeActionId ? colors.secondary : colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
      lineSpacing: 5,
    });
  }

  private renderChoices(): void {
    if (this.locationId === "deepForest") {
      createTextAction(this, columns.center, 228, "Follow the hidden path back to the forest", () => {
        this.scene.start("explore", { locationId: "forest" });
      });
      return;
    }

    const actions = getPlaceActions(this.locationId);
    actions.forEach((action, index) => {
      const isActive = this.activeActionId === action.id;
      createTextAction(
        this,
        columns.center,
        228 + index * 30,
        isActive ? "You are occupied..." : action.label,
        () => this.beginPlaceAction(action),
        this.activeActionId === undefined,
      );
    });

    let nextY = 228 + actions.length * 30;
    if (
      this.locationId === "forest" &&
      gameState.discoveredLocations.includes("deepForest")
    ) {
      createTextAction(
        this,
        columns.center,
        nextY,
        "Follow the hidden path deeper",
        () => this.scene.start("explore", { locationId: "deepForest" }),
        this.activeActionId === undefined,
      );
      nextY += 34;
    }

    createTextAction(
      this,
      columns.center,
      nextY,
      this.getReturnLabel(),
      () => this.scene.start("town"),
      this.activeActionId === undefined,
    );
  }

  private beginPlaceAction(action: PlaceAction): void {
    this.activeActionId = action.id;
    let secondsRemaining = action.durationSeconds;
    this.message = `You take your time. ${secondsRemaining}s remaining.`;
    this.renderPlace();

    this.time.addEvent({
      delay: 1000,
      repeat: action.durationSeconds - 1,
      callback: () => {
        secondsRemaining -= 1;
        if (secondsRemaining > 0) {
          this.message = `You continue carefully. ${secondsRemaining}s remaining.`;
          this.renderPlace();
          return;
        }

        const result = completePlaceAction(this.locationId, action);
        this.activeActionId = undefined;
        this.message = this.describeResult(result);
        this.renderPlace();
      },
    });
  }

  private describeResult(result: PlaceActionResult): string {
    const lines = [result.resultText];
    const findings = this.formatFindings(result.findings);
    if (findings) {
      lines.push(`You carry back ${findings}.`);
    }
    if (result.discoveredLocation) {
      lines.push(
        "Repeated visits reveal a path hidden beneath the undergrowth.",
        `You will remember the way to ${locations[result.discoveredLocation].name}.`,
      );
    }
    return lines.join("\n");
  }

  private formatFindings(findings: ResourceAmounts): string {
    return Object.entries(findings)
      .map(
        ([resourceId, amount]) =>
          `${amount} ${resources[resourceId as ResourceId].name}`,
      )
      .join(" and ");
  }

  private getReturnLabel(): string {
    if (this.locationId === "forest") {
      return "Follow the path south to the village edge";
    }
    if (this.locationId === "mine") {
      return "Leave the passage and walk west";
    }
    return "Walk back toward Willow Village";
  }

  private getNearbyPlaces(): string[] {
    if (
      this.locationId === "forest" &&
      gameState.discoveredLocations.includes("deepForest")
    ) {
      return ["Village Edge", "Deep Forest"];
    }
    if (this.locationId === "deepForest") {
      return ["Forest"];
    }
    return ["Willow Village"];
  }
}
