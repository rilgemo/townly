import type { Player, ResourceInventory } from "../types/game";

export interface GameState {
  player: Player;
  town: {
    level: number;
  };
  resources: ResourceInventory;
}

export const gameState: GameState = {
  player: {
    name: "Traveler",
    level: 1,
  },
  town: {
    level: 1,
  },
  resources: {
    wood: 0,
    stone: 0,
    herb: 0,
  },
};
