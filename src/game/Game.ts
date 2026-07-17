import Phaser from "phaser";

import { gameConfig } from "./config";

export function startGame(): Phaser.Game {
  return new Phaser.Game(gameConfig);
}
