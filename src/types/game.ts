export type Direction = "north" | "east" | "south" | "west";

export type LocationId = "town" | "forest" | "mine" | "plains" | "lake";

export interface Location {
  id: LocationId;
  name: string;
  symbol: string;
  description: string;
  color: number;
  exits: Partial<Record<Direction, LocationId>>;
}
