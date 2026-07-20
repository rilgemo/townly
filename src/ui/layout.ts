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
  scene.add.text(columns.left, 48, "CARRYING", subtleHeading());
  const carriedResourceIds = resourceIds.filter(
    (resourceId) => isResourceKnown(resourceId) && getResourceAmount(resourceId) > 0,
  );
  if (carriedResourceIds.length === 0) {
    scene.add.text(columns.left, 76, "Nothing", bodyStyle(colors.muted));
  } else {
    carriedResourceIds.forEach((resourceId, index) => {
      const resource = resources[resourceId];
      scene.add.text(
        columns.left,
        76 + index * 24,
        `${resource.symbol} ${resource.name.padEnd(8)} ${getResourceAmount(resourceId)}`,
        bodyStyle(),
      );
    });
  }

  const knownPlaces = getKnownPlaces();
  if (knownPlaces.length > 0) {
    scene.add.text(columns.left, 190, "KNOWN PLACES", subtleHeading());
    knownPlaces.forEach((place, index) => {
      scene.add.text(
        columns.left,
        218 + index * 22,
        `• ${place}`,
        bodyStyle(colors.muted),
      );
    });
  }
}

function renderWorldContext(scene: Phaser.Scene, nearbyPlaces: string[]): void {
  scene.add.text(columns.right, 48, getEnvironmentalContext(), {
    ...bodyStyle(colors.muted),
    lineSpacing: 8,
    wordWrap: { width: 230 },
  });

  renderSettingsEntry(scene);

  if (nearbyPlaces.length === 0) {
    return;
  }

  scene.add.text(
    columns.right,
    176,
    "PATHS YOU RECOGNIZE",
    subtleHeading(),
  );
  nearbyPlaces.slice(0, 4).forEach((place, index) => {
    scene.add.text(columns.right, 204 + index * 26, `• ${place}`, bodyStyle());
  });
}

function renderSettingsEntry(scene: Phaser.Scene): void {
  const controls: Phaser.GameObjects.Text[] = [];
  const saveAction = createTextAction(scene, columns.right, 430, "Save", () => {
    saveGame();
  });
  const loadAction = createTextAction(scene, columns.right, 458, "Load", () => {
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
    scene.scene.start(gameState.introduction.completed ? "town" : "arrival");
  });
  const resetAction = createTextAction(scene, columns.right, 486, "Begin again", () => {
    const confirmed = window.confirm(
      "Return Willow Village to the moment before your arrival? This will clear all saved progress.",
    );
    if (!confirmed) {
      return;
    }
    resetGame();
    window.location.reload();
  });
  controls.push(saveAction, loadAction, resetAction);
  controls.forEach((control) => control.setVisible(false).disableInteractive());

  let settingsOpen = false;
  createTextAction(scene, columns.right, 514, "Settings", () => {
    settingsOpen = !settingsOpen;
    controls.forEach((control) => {
      control.setVisible(settingsOpen);
      if (settingsOpen) {
        control.setInteractive({ useHandCursor: true });
      } else {
        control.disableInteractive();
      }
    });
  });
}

function getKnownPlaces(): string[] {
  const places: string[] = [];
  if (gameState.knowledge.knowsVillage) {
    places.push("Willow Village");
  }
  if (gameState.introduction.shelterReceived) {
    places.push("Your shelter");
  }
  if (gameState.knowledge.knowsForest) {
    places.push("Forest path");
  }
  if (gameState.knowledge.knowsMine) {
    places.push("Mine side passage");
  }
  if (gameState.knowledge.knowsLake) {
    places.push("Western lakeshore");
  }
  if (gameState.knowledge.knowsPlains) {
    places.push("Road to the southern plains");
  }
  if (gameState.discoveredLocations.includes("deepForest")) {
    places.push("Hidden forest path");
  }
  return places;
}

function getEnvironmentalContext(): string {
  if (!gameState.introduction.completed) {
    return "The road is quiet.\nA faint breeze moves through the grass.";
  }
  if (gameState.player.currentScene === "explore") {
    return "Willow Village lies behind you.\nThe sounds here belong to wilder ground.";
  }
  if (gameState.currentTownPlace === "shelter") {
    return "Village sounds reach the empty room through its worn walls.";
  }
  if (gameState.currentTownPlace === "townHall") {
    return gameState.restoration.townHallDoorRepaired
      ? "The old hall remains worn, but its door closes cleanly now."
      : "Dust and old paper mingle with the scent of the small fire.";
  }
  if (gameState.currentTownPlace === "villageEdge") {
    return "Leaves stir beyond the last cottages. The air carries the scent of damp wood.";
  }
  if (gameState.currentTownPlace === "mineEntrance") {
    return "Cool air slips between fallen stones. The hillside is otherwise still.";
  }
  if (gameState.currentTownPlace === "southRoad") {
    return "The village grows quieter behind the gate. Open country stretches south.";
  }
  return gameState.restoration.townHallDoorRepaired
    ? "Cooking smoke drifts between the houses. The old hall feels slightly less forgotten."
    : "The smell of cooking smoke drifts from nearby houses.";
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
