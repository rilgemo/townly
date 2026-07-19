import { gameState } from "../state/GameState";
import type { ResourceAmounts, ResourceId } from "../types/game";

export function addResources(resources: ResourceAmounts): void {
  for (const [resourceId, amount] of Object.entries(resources)) {
    gameState.resources[resourceId as ResourceId] += amount ?? 0;
  }
}

export function getResourceAmount(resourceId: ResourceId): number {
  return gameState.resources[resourceId];
}

export function hasResources(cost: ResourceAmounts): boolean {
  return Object.entries(cost).every(
    ([resourceId, amount]) =>
      gameState.resources[resourceId as ResourceId] >= (amount ?? 0),
  );
}

export function spendResources(cost: ResourceAmounts): boolean {
  if (!hasResources(cost)) {
    return false;
  }

  for (const [resourceId, amount] of Object.entries(cost)) {
    gameState.resources[resourceId as ResourceId] -= amount ?? 0;
  }

  return true;
}
