import { gameState } from "../state/GameState";
import type { ResourceAmounts } from "../types/game";
import { hasResources, spendResources } from "./ResourceSystem";

export const townHallUpgradeCost: ResourceAmounts = {
  wood: 10,
  stone: 5,
};

export function canUpgradeTownHall(): boolean {
  return gameState.town.level === 1 && hasResources(townHallUpgradeCost);
}

export function upgradeTownHall(): boolean {
  if (gameState.town.level !== 1 || !spendResources(townHallUpgradeCost)) {
    return false;
  }

  gameState.town.level = 2;
  return true;
}
