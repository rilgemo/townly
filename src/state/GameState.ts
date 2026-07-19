import type { LocationId, Player, ResourceInventory } from "../types/game";

export interface GameState {
  player: Player;
  restoration: {
    townHallDoorRepaired: boolean;
  };
  discoveredLocations: LocationId[];
  explorationCounts: Partial<Record<LocationId, number>>;
  currentTownPlace:
    | "townSquare"
    | "townHall"
    | "shelter"
    | "villageEdge"
    | "mineEntrance"
    | "southRoad";
  villagePeople: {
    woodsmanMet: boolean;
    formerMinerMet: boolean;
  };
  knowledge: {
    knowsVillage: boolean;
    surveyedVillage: boolean;
    knowsForest: boolean;
    knowsMine: boolean;
    knowsLake: boolean;
    knowsPlains: boolean;
    knowsWood: boolean;
    knowsStone: boolean;
    knowsHerb: boolean;
  };
  introduction: {
    currentPlace: "outskirts" | "gate" | "townSquare" | "townHall";
    lookedAround: boolean;
    guardMet: boolean;
    villageEntered: boolean;
    chiefMet: boolean;
    shelterReceived: boolean;
    completed: boolean;
  };
  resources: ResourceInventory;
}

export function createInitialGameState(): GameState {
  return {
    player: {
      name: "Traveler",
      level: 1,
      currentScene: "arrival",
    },
    restoration: {
      townHallDoorRepaired: false,
    },
    discoveredLocations: ["town", "plains", "lake"],
    explorationCounts: {},
    currentTownPlace: "townSquare",
    villagePeople: {
      woodsmanMet: false,
      formerMinerMet: false,
    },
    knowledge: {
      knowsVillage: false,
      surveyedVillage: false,
      knowsForest: false,
      knowsMine: false,
      knowsLake: false,
      knowsPlains: false,
      knowsWood: false,
      knowsStone: false,
      knowsHerb: false,
    },
    introduction: {
      currentPlace: "outskirts",
      lookedAround: false,
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
}

export const gameState: GameState = createInitialGameState();
