import type { LocationId, Player, ResourceInventory } from "../types/game";

export interface GameState {
  player: Player;
  town: {
    level: number;
  };
  discoveredLocations: LocationId[];
  explorationCounts: Partial<Record<LocationId, number>>;
  introduction: {
    currentPlace: "outskirts" | "gate" | "townSquare" | "townHall";
    guardMet: boolean;
    villageEntered: boolean;
    chiefMet: boolean;
    shelterReceived: boolean;
    completed: boolean;
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
  discoveredLocations: ["town", "forest", "mine", "plains", "lake"],
  explorationCounts: {},
  introduction: {
    currentPlace: "outskirts",
    guardMet: false,
    villageEntered: false,
    chiefMet: false,
    shelterReceived: false,
    completed: false,
  },
  resources: {
    wood: 0,
    stone: 0,
    herb: 0,
  },
};
