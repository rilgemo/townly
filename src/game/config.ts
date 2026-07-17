import Phaser from "phaser";

import { ArrivalScene } from "../scenes/ArrivalScene";
import { ExploreScene } from "../scenes/ExploreScene";
import { TownScene } from "../scenes/TownScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#121411",
  scene: [ArrivalScene, TownScene, ExploreScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
  },
};
