import type { ResourceId } from "../types/game";

interface ResourceDefinition {
  id: ResourceId;
  name: string;
  symbol: string;
}

export const resources: Record<ResourceId, ResourceDefinition> = {
  wood: { id: "wood", name: "Wood", symbol: "▰" },
  stone: { id: "stone", name: "Stone", symbol: "◆" },
  herb: { id: "herb", name: "Herb", symbol: "✦" },
};

export const resourceIds: ResourceId[] = ["wood", "stone", "herb"];
