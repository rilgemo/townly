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

export function renderLayout(
  scene: Phaser.Scene,
  currentArea: string,
  currentPlace: string,
): void {
  scene.cameras.main.setBackgroundColor(colors.background);

  const dividers = scene.add.graphics();
  dividers.lineStyle(1, 0x42463f, 0.9);
  dividers.lineBetween(260, 24, 260, 516);
  dividers.lineBetween(700, 24, 700, 516);

  renderTownSidebar(scene);
  renderAreaSidebar(scene, currentArea, currentPlace);
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

function renderTownSidebar(scene: Phaser.Scene): void {
  scene.add.text(columns.left, 28, "🏠 TOWNLY", {
    color: colors.primary,
    fontFamily: fonts.title,
    fontSize: "22px",
  });

  addSectionTitle(scene, columns.left, 78, "Town Status");
  scene.add.text(columns.left, 104, `Town Level     ${gameState.town.level}`, bodyStyle());
  scene.add.text(columns.left, 128, `Player         ${gameState.player.name}`, bodyStyle());

  addSectionTitle(scene, columns.left, 178, "Resources");
  resourceIds.forEach((resourceId, index) => {
    const resource = resources[resourceId];
    scene.add.text(
      columns.left,
      204 + index * 26,
      `${resource.symbol} ${resource.name.padEnd(8)} ${getResourceAmount(resourceId)}`,
      bodyStyle(),
    );
  });

  addSectionTitle(scene, columns.left, 314, "Buildings");
  scene.add.text(columns.left, 340, `🏛 Town Hall    Lv.${gameState.town.level}`, bodyStyle());
  scene.add.text(
    columns.left,
    366,
    `🛖 Shelter      ${gameState.introduction.shelterReceived ? "Temporary" : "—"}`,
    bodyStyle(),
  );
}

function renderAreaSidebar(
  scene: Phaser.Scene,
  currentArea: string,
  currentPlace: string,
): void {
  addSectionTitle(scene, columns.right, 32, "Current Area");
  scene.add.text(columns.right, 62, currentArea, {
    color: colors.primary,
    fontFamily: fonts.title,
    fontSize: "20px",
  });
  scene.add.text(columns.right, 94, currentPlace, bodyStyle(colors.secondary));

  addSectionTitle(scene, columns.right, 158, "Time");
  scene.add.text(columns.right, 186, "Day 1", bodyStyle());
  scene.add.text(columns.right, 212, "--:--", bodyStyle(colors.muted));
  scene.add.text(columns.right, 244, "Time does not pass\nhere yet.", {
    ...bodyStyle(colors.muted),
    lineSpacing: 6,
  });
}

function bodyStyle(color = colors.secondary): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    color,
    fontFamily: fonts.body,
    fontSize: "13px",
  };
}
