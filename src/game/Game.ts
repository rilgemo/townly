import Phaser from "phaser";

import { loadGame } from "../systems/PersistenceSystem";
import { gameConfig } from "./config";

export function startGame(): Phaser.Game {
  loadGame();
  return new Phaser.Game(gameConfig);
}
