import type { LocationId, Player, ResourceInventory } from "../types/game";

export interface GameState {
  player: Player;
  town: {
    level: number;
  };
  discoveredLocations: LocationId[];
  explorationCounts: Partial<Record<LocationId, number>>;
  currentTownPlace:
    | "townSquare"
    | "townHall"
    | "shelter"
    | "villageEdge"
    | "mineEntrance";
  villagePeople: {
    woodsmanMet: boolean;
    formerMinerMet: boolean;
  };
  knowledge: {
    knowsVillage: boolean;
    surveyedVillage: boolean;
    knowsForest: boolean;
    knowsMine: boolean;
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
    woodsmanMet: false,
    formerMinerMet: false,
  },
  knowledge: {
    knowsVillage: false,
    surveyedVillage: false,
    knowsForest: false,
    knowsMine: false,
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
