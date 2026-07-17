import type Phaser from "phaser";

export const colors = {
  background: "#121411",
  primary: "#ddd8c9",
  secondary: "#999d91",
  muted: "#62675f",
  accent: "#b8c59b",
  action: "#d5b97b",
  success: "#a9c98f",
  disabled: "#555a53",
};

export const fonts = {
  body: 'Consolas, "Courier New", monospace',
  title: 'Georgia, "Times New Roman", serif',
};

export function addDivider(
  scene: Phaser.Scene,
  y: number,
  x = 70,
  width = 820,
): Phaser.GameObjects.Text {
  return scene.add.text(x, y, "─".repeat(Math.floor(width / 10)), {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: "13px",
  });
}
