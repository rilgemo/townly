import { addResources } from "./ResourceSystem";
import type { LocationId, ResourceReward } from "../types/game";

export interface Exploration {
  durationSeconds: number;
  reward: ResourceReward;
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

export function completeExploration(exploration: Exploration): ResourceReward {
  addResources(exploration.reward);
  return exploration.reward;
}
