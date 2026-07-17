import type { LocationId, Player, ResourceInventory } from "../types/game";

export interface GameState {
  player: Player;
  town: {
    level: number;
  };
  discoveredLocations: LocationId[];
  explorationCounts: Partial<Record<LocationId, number>>;
  currentTownPlace: "townSquare" | "villageEdge" | "mineEntrance";
  villagePeople: {
    lumberjackMet: boolean;
    minerMet: boolean;
  };
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
  discoveredLocations: ["town", "plains", "lake"],
  explorationCounts: {},
  currentTownPlace: "townSquare",
  villagePeople: {
    lumberjackMet: false,
    minerMet: false,
  },
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
