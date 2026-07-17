import { gameState } from "../state/GameState";
import type { ResourceId, ResourceReward } from "../types/game";

export function addResources(reward: ResourceReward): void {
  for (const [resourceId, amount] of Object.entries(reward)) {
    gameState.resources[resourceId as ResourceId] += amount ?? 0;
  }
}

export function getResourceAmount(resourceId: ResourceId): number {
  return gameState.resources[resourceId];
}
