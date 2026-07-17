import Phaser from "phaser";

export class TownScene extends Phaser.Scene {
  constructor() {
    super("town");
  }

  create(): void {
    const { centerX, centerY } = this.cameras.main;

    this.add
      .text(centerX, centerY - 42, "Townly", {
        color: "#f5d98f",
        fontFamily: "Georgia, serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 34, "A tiny town. A wide world.", {
        color: "#d8cbb1",
        fontFamily: "Georgia, serif",
        fontSize: "22px",
      })
      .setOrigin(0.5);
  }
}
