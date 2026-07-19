import Phaser from "phaser";

import { resourceIds, resources } from "../data/resources";
import { gameState } from "../state/GameState";
import {
  loadGame,
  resetGame,
  saveGame,
} from "../systems/PersistenceSystem";
import { getResourceAmount } from "../systems/ResourceSystem";
import { colors, fonts } from "./theme";

export const columns = {
  left: 32,
  center: 286,
  right: 726,
};

interface LayoutContext {
  nearbyPlaces?: string[];
}

export function renderLayout(
  scene: Phaser.Scene,
  context: LayoutContext = {},
): void {
  scene.cameras.main.setBackgroundColor(colors.background);
  renderPlayerContext(scene);
  renderWorldContext(scene, context.nearbyPlaces ?? []);
}

export function createTextAction(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  callback: () => void,
  enabled = true,
): Phaser.GameObjects.Text {
  const action = scene.add.text(x, y, `• ${label}`, {
    color: enabled ? colors.action : colors.disabled,
    fontFamily: fonts.body,
    fontSize: "14px",
  });

  if (!enabled) {
    return action;
  }

  action.setInteractive({ useHandCursor: true });
  action.on("pointerover", () => action.setColor(colors.primary));
  action.on("pointerout", () => action.setColor(colors.action));
  action.on("pointerdown", callback);
  return action;
}

function renderPlayerContext(scene: Phaser.Scene): void {
  scene.add.text(columns.left, 28, "You", {
    color: colors.primary,
    fontFamily: fonts.title,
    fontSize: "22px",
  });

  scene.add.text(
    columns.left,
    76,
    gameState.knowledge.knowsVillage
      ? `${gameState.player.name}.\nA traveler in Willow Village.`
      : "A stranger.\nYou remember little of this place.",
    {
      ...bodyStyle(),
      lineSpacing: 7,
    },
  );

  if (gameState.introduction.shelterReceived) {
    scene.add.text(
      columns.left,
      136,
      "You have a place to rest.",
      bodyStyle(colors.muted),
    );
  }

  const knownResourceIds = resourceIds.filter(isResourceKnown);
  if (knownResourceIds.length > 0) {
    scene.add.text(columns.left, 196, "BELONGINGS", subtleHeading());
    knownResourceIds.forEach((resourceId, index) => {
      const resource = resources[resourceId];
      scene.add.text(
        columns.left,
        224 + index * 24,
        `${resource.symbol} ${resource.name.padEnd(8)} ${getResourceAmount(resourceId)}`,
        bodyStyle(),
      );
    });
  }

  const knowledge = getKnownKnowledge();
  if (knowledge.length > 0) {
    scene.add.text(columns.left, 330, "THINGS YOU'VE LEARNED", subtleHeading());
    knowledge.forEach((item, index) => {
      scene.add.text(
        columns.left,
        358 + index * 22,
        `• ${item}`,
        bodyStyle(colors.muted),
      );
    });
  }
}

function renderWorldContext(scene: Phaser.Scene, nearbyPlaces: string[]): void {
  scene.add.text(columns.right, 36, "Morning", {
    color: colors.primary,
    fontFamily: fonts.title,
    fontSize: "18px",
  });
  scene.add.text(columns.right, 68, "The sky is clear.", bodyStyle(colors.muted));

  renderPersistenceActions(scene);

  if (nearbyPlaces.length === 0) {
    return;
  }

  scene.add.text(
    columns.right,
    160,
    "You could find your way to",
    bodyStyle(colors.muted),
  );
  nearbyPlaces.slice(0, 4).forEach((place, index) => {
    scene.add.text(columns.right, 194 + index * 26, `• ${place}`, bodyStyle());
  });
}

function renderPersistenceActions(scene: Phaser.Scene): void {
  createTextAction(scene, columns.right, 430, "Save Game", () => {
    saveGame();
  });
  createTextAction(scene, columns.right, 458, "Load Game", () => {
    if (!loadGame()) {
      return;
    }
    if (
      gameState.player.currentScene === "explore" &&
      gameState.player.currentLocation
    ) {
      scene.scene.start("explore", {
        locationId: gameState.player.currentLocation,
      });
      return;
    }
    scene.scene.start(
      gameState.introduction.completed ? "town" : "arrival",
    );
  });
  createTextAction(scene, columns.right, 486, "Reset Game", () => {
    const confirmed = window.confirm(
      "Return Willow Village to the moment before your arrival? This will clear all saved progress.",
    );
    if (!confirmed) {
      return;
    }
    resetGame();
    window.location.reload();
  });
}

function getKnownKnowledge(): string[] {
  const knowledge: string[] = [];
  if (gameState.knowledge.knowsVillage) {
    knowledge.push("Willow Village");
  }
  if (gameState.introduction.shelterReceived) {
    knowledge.push("Your shelter");
  }
  if (gameState.knowledge.knowsForest) {
    knowledge.push("Forest path");
  }
  if (gameState.knowledge.knowsMine) {
    knowledge.push("Mine side passage");
  }
  if (gameState.knowledge.knowsLake) {
    knowledge.push("Western lakeshore");
  }
  if (gameState.knowledge.knowsPlains) {
    knowledge.push("Road to the southern plains");
  }
  if (gameState.discoveredLocations.includes("deepForest")) {
    knowledge.push("Hidden forest path");
  }
  if (gameState.restoration.townHallDoorRepaired) {
    knowledge.push("Mended Town Hall door");
  }
  return knowledge;
}

function isResourceKnown(resourceId: (typeof resourceIds)[number]): boolean {
  if (resourceId === "wood") {
    return gameState.knowledge.knowsWood;
  }
  if (resourceId === "stone") {
    return gameState.knowledge.knowsStone;
  }
  return gameState.knowledge.knowsHerb;
}

function subtleHeading(): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    color: colors.accent,
    fontFamily: fonts.body,
    fontSize: "11px",
  };
}

function bodyStyle(color = colors.secondary): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    color,
    fontFamily: fonts.body,
    fontSize: "13px",
  };
}
