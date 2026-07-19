export type Direction = "north" | "east" | "south" | "west";

export type LocationId =
  | "town"
  | "forest"
  | "deepForest"
  | "mine"
  | "plains"
  | "lake";

export type ResourceId = "wood" | "stone" | "herb";

export interface Player {
  name: string;
  level: number;
}

export type ResourceInventory = Record<ResourceId, number>;

export type ResourceAmounts = Partial<ResourceInventory>;

export interface Location {
  id: LocationId;
  name: string;
  symbol: string;
  description: string;
  color: number;
  exits: Partial<Record<Direction, LocationId>>;
}
