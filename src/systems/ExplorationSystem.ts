import { addResources } from "./ResourceSystem";
import { gameState } from "../state/GameState";
import type { LocationId, ResourceReward } from "../types/game";

export interface Exploration {
  durationSeconds: number;
  reward: ResourceReward;
}

export interface ExplorationResult {
  reward: ResourceReward;
  discoveredLocation?: LocationId;
}

const explorations: Partial<Record<LocationId, Exploration>> = {
  forest: {
    durationSeconds: 10,
    reward: { wood: 3, herb: 1 },
  },
  mine: {
    durationSeconds: 10,
    reward: { stone: 2 },
  },
};

export function getExploration(locationId: LocationId): Exploration | undefined {
  return explorations[locationId];
}

export function completeExploration(
  locationId: LocationId,
  exploration: Exploration,
): ExplorationResult {
  addResources(exploration.reward);
  gameState.explorationCounts[locationId] =
    (gameState.explorationCounts[locationId] ?? 0) + 1;

  let discoveredLocation: LocationId | undefined;
  if (
    locationId === "forest" &&
    (gameState.explorationCounts.forest ?? 0) >= 3 &&
    !gameState.discoveredLocations.includes("deepForest")
  ) {
    discoveredLocation = "deepForest";
    gameState.discoveredLocations.push(discoveredLocation);
  }

  return {
    reward: exploration.reward,
    discoveredLocation,
  };
}
