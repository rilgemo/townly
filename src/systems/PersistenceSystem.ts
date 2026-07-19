import { createInitialGameState, gameState, type GameState } from "../state/GameState";
import type { LocationId } from "../types/game";

const SAVE_KEY = "townly.save";
const SAVE_VERSION = 1;

interface SaveEnvelope {
  version: number;
  timestamp: string;
  gameState: GameState;
}

export function saveGame(): boolean {
  if (!hasLocalStorage()) {
    return false;
  }

  const save: SaveEnvelope = {
    version: SAVE_VERSION,
    timestamp: new Date().toISOString(),
    gameState,
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): boolean {
  if (!hasLocalStorage()) {
    return false;
  }

  try {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) {
      return false;
    }

    const save: unknown = JSON.parse(rawSave);
    if (!isSaveEnvelope(save)) {
      clearInvalidSave();
      return false;
    }

    replaceGameState(save.gameState);
    return true;
  } catch {
    clearInvalidSave();
    return false;
  }
}

export function resetGame(): void {
  if (hasLocalStorage()) {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {}
  }
  replaceGameState(createInitialGameState());
}

function replaceGameState(nextState: GameState): void {
  const cleanState = JSON.parse(JSON.stringify(nextState)) as GameState;
  Object.assign(gameState, cleanState);
}

function isSaveEnvelope(value: unknown): value is SaveEnvelope {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.version === SAVE_VERSION &&
    typeof value.timestamp === "string" &&
    isGameState(value.gameState)
  );
}

function isGameState(value: unknown): value is GameState {
  if (!isRecord(value)) {
    return false;
  }

  const player = value.player;
  const restoration = value.restoration;
  const resources = value.resources;
  const introduction = value.introduction;
  const knowledge = value.knowledge;
  const villagePeople = value.villagePeople;

  return (
    isRecord(player) &&
    typeof player.name === "string" &&
    typeof player.level === "number" &&
    isPlayerScene(player.currentScene) &&
    (player.currentLocation === undefined || isLocationId(player.currentLocation)) &&
    isRecord(restoration) &&
    typeof restoration.townHallDoorRepaired === "boolean" &&
    Array.isArray(value.discoveredLocations) &&
    value.discoveredLocations.every(isLocationId) &&
    isRecord(value.explorationCounts) &&
    Object.entries(value.explorationCounts).every(
      ([locationId, count]) =>
        isLocationId(locationId) && isNonNegativeNumber(count),
    ) &&
    isTownPlace(value.currentTownPlace) &&
    hasBooleanFields(villagePeople, ["woodsmanMet", "formerMinerMet"]) &&
    hasBooleanFields(knowledge, [
      "knowsVillage",
      "surveyedVillage",
      "knowsForest",
      "knowsMine",
      "knowsLake",
      "knowsPlains",
      "knowsWood",
      "knowsStone",
      "knowsHerb",
    ]) &&
    isRecord(introduction) &&
    isIntroductionPlace(introduction.currentPlace) &&
    hasBooleanFields(introduction, [
      "lookedAround",
      "guardMet",
      "villageEntered",
      "chiefMet",
      "shelterReceived",
      "completed",
    ]) &&
    isRecord(resources) &&
    isNonNegativeNumber(resources.wood) &&
    isNonNegativeNumber(resources.stone) &&
    isNonNegativeNumber(resources.herb)
  );
}

function hasBooleanFields(
  value: unknown,
  fields: string[],
): value is Record<string, boolean> {
  return isRecord(value) && fields.every((field) => typeof value[field] === "boolean");
}

function isPlayerScene(value: unknown): boolean {
  return value === "arrival" || value === "town" || value === "explore";
}

function isTownPlace(value: unknown): boolean {
  return (
    value === "townSquare" ||
    value === "townHall" ||
    value === "shelter" ||
    value === "villageEdge" ||
    value === "mineEntrance" ||
    value === "southRoad"
  );
}

function isIntroductionPlace(value: unknown): boolean {
  return (
    value === "outskirts" ||
    value === "gate" ||
    value === "townSquare" ||
    value === "townHall"
  );
}

function isLocationId(value: unknown): value is LocationId {
  return (
    value === "town" ||
    value === "forest" ||
    value === "deepForest" ||
    value === "mine" ||
    value === "plains" ||
    value === "lake"
  );
}

function isNonNegativeNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasLocalStorage(): boolean {
  return typeof localStorage !== "undefined";
}

function clearInvalidSave(): void {
  replaceGameState(createInitialGameState());
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
