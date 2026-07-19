import { gameState } from "../state/GameState";
import type { LocationId, ResourceAmounts } from "../types/game";
import { addResources } from "./ResourceSystem";

export interface PlaceAction {
  id: string;
  label: string;
  durationSeconds: number;
  findings: ResourceAmounts;
  resultText: string;
}

export interface PlaceActionResult {
  findings: ResourceAmounts;
  resultText: string;
  discoveredLocation?: LocationId;
}

const placeActions: Partial<Record<LocationId, PlaceAction[]>> = {
  forest: [
    {
      id: "fallen-branches",
      label: "Search among the fallen branches",
      durationSeconds: 10,
      findings: { wood: 3 },
      resultText:
        "Beneath damp leaves, you find fallen branches dry enough to carry back.",
    },
    {
      id: "wild-plants",
      label: "Examine the wild plants",
      durationSeconds: 10,
      findings: { herb: 1 },
      resultText:
        "Among the undergrowth, you recognize a small plant that may be useful.",
    },
  ],
  mine: [
    {
      id: "loose-rubble",
      label: "Search through the loose rubble",
      durationSeconds: 10,
      findings: { stone: 2 },
      resultText:
        "Near the collapsed wall, you collect several solid pieces of usable stone.",
    },
  ],
};

export function getPlaceActions(locationId: LocationId): PlaceAction[] {
  return placeActions[locationId] ?? [];
}

export function completePlaceAction(
  locationId: LocationId,
  action: PlaceAction,
): PlaceActionResult {
  addResources(action.findings);
  revealFoundMaterials(action.findings);

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
    findings: action.findings,
    resultText: action.resultText,
    discoveredLocation,
  };
}

function revealFoundMaterials(findings: ResourceAmounts): void {
  if ((findings.wood ?? 0) > 0) {
    gameState.knowledge.knowsWood = true;
  }
  if ((findings.stone ?? 0) > 0) {
    gameState.knowledge.knowsStone = true;
  }
  if ((findings.herb ?? 0) > 0) {
    gameState.knowledge.knowsHerb = true;
  }
}
