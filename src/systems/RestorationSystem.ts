import { gameState } from "../state/GameState";
import type { ResourceAmounts } from "../types/game";
import { hasResources, spendResources } from "./ResourceSystem";

const townHallDoorMaterials: ResourceAmounts = {
  wood: 10,
  stone: 5,
};

export function canRepairTownHallDoor(): boolean {
  return (
    !gameState.restoration.townHallDoorRepaired &&
    hasResources(townHallDoorMaterials)
  );
}

export function repairTownHallDoor(): boolean {
  if (
    gameState.restoration.townHallDoorRepaired ||
    !spendResources(townHallDoorMaterials)
  ) {
    return false;
  }

  gameState.restoration.townHallDoorRepaired = true;
  return true;
}
