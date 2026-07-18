import Phaser from "phaser";

import { resourceIds, resources } from "../data/resources";
import { gameState } from "../state/GameState";
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
  currentArea: string,
  currentPlace: string,
  context: LayoutContext = {},
): void {
  scene.cameras.main.setBackgroundColor(colors.background);

  const dividers = scene.add.graphics();
  dividers.lineStyle(1, 0x42463f, 0.9);
  dividers.lineBetween(260, 24, 260, 516);
  dividers.lineBetween(700, 24, 700, 516);

  renderPlayerSidebar(scene);
  renderWorldSidebar(scene, currentArea, currentPlace, context.nearbyPlaces ?? []);
}

export function addSectionTitle(
  scene: Phaser.Scene,
  x: number,
  y: number,
  title: string,
): Phaser.GameObjects.Text {
  return scene.add.text(x, y, title.toUpperCase(), {
    color: colors.accent,
    fontFamily: fonts.body,
    fontSize: "12px",
    fontStyle: "bold",
  });
}

export function createTextAction(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  callback: () => void,
  enabled = true,
): Phaser.GameObjects.Text {
  const action = scene.add.text(x, y, `> ${label}`, {
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

function renderPlayerSidebar(scene: Phaser.Scene): void {
  scene.add.text(columns.left, 28, "YOU", {
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
    scene.add.text(columns.left, 136, "You have a place to rest.", bodyStyle(colors.muted));
  }

  addSectionTitle(scene, columns.left, 196, "Carrying");
  const knownResourceIds = resourceIds.filter(isResourceKnown);
  if (knownResourceIds.length === 0) {
    scene.add.text(columns.left, 224, "Nothing", bodyStyle(colors.muted));
  }
  knownResourceIds.forEach((resourceId, index) => {
    const resource = resources[resourceId];
    scene.add.text(
      columns.left,
      224 + index * 24,
      `${resource.symbol} ${resource.name.padEnd(8)} ${getResourceAmount(resourceId)}`,
      bodyStyle(),
    );
  });

  const knowledge = getKnownKnowledge();
  if (knowledge.length > 0) {
    addSectionTitle(scene, columns.left, 330, "You Know");
    knowledge.forEach((item, index) => {
      scene.add.text(columns.left, 358 + index * 22, `· ${item}`, bodyStyle(colors.muted));
    });
  }
}

function renderWorldSidebar(
  scene: Phaser.Scene,
  currentArea: string,
  currentPlace: string,
  nearbyPlaces: string[],
): void {
  scene.add.text(columns.right, 28, "AROUND YOU", {
    color: colors.primary,
    fontFamily: fonts.title,
    fontSize: "22px",
  });

  if (currentArea === "Unknown") {
    scene.add.text(columns.right, 76, "You don't recognize\nthis place.", {
      ...bodyStyle(),
      lineSpacing: 7,
    });
  } else {
    scene.add.text(columns.right, 76, currentArea, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "18px",
    });
    scene.add.text(columns.right, 108, currentPlace, bodyStyle(colors.secondary));
  }

  scene.add.text(columns.right, 172, "Morning", bodyStyle());
  scene.add.text(columns.right, 198, "The sky is clear.", bodyStyle(colors.muted));

  if (nearbyPlaces.length === 0) {
    return;
  }

  addSectionTitle(scene, columns.right, 270, "You Notice");
  if (nearbyPlaces.length === 0) {
    return;
  }

  nearbyPlaces.slice(0, 4).forEach((place, index) => {
    scene.add.text(columns.right, 298 + index * 24, `· ${place}`, bodyStyle());
  });
}

function getKnownKnowledge(): string[] {
  const knowledge: string[] = [];

  if (gameState.knowledge.knowsVillage) {
    knowledge.push("Willow Village");
  }
  if (gameState.knowledge.knowsForest) {
    knowledge.push("Forest path");
  }
  if (gameState.knowledge.knowsMine) {
    knowledge.push("Mine side passage");
  }
  if (gameState.discoveredLocations.includes("deepForest")) {
    knowledge.push("Hidden forest path");
  }
  if (gameState.town.level >= 2) {
    knowledge.push("Restored Town Hall");
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

function bodyStyle(color = colors.secondary): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    color,
    fontFamily: fonts.body,
    fontSize: "13px",
  };
}
