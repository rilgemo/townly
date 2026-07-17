import type { Location, LocationId } from "../types/game";

export const locations: Record<LocationId, Location> = {
  town: {
    id: "town",
    name: "Town",
    symbol: "⌂",
    description: "A small settlement at the heart of the wilds.",
    color: 0xc8945d,
    exits: {
      north: "forest",
      east: "plains",
      south: "lake",
      west: "mine",
    },
  },
  forest: {
    id: "forest",
    name: "Forest",
    symbol: "♠",
    description: "Tall trees gather beyond the northern road.",
    color: 0x4f7a4b,
    exits: { south: "town" },
  },
  mine: {
    id: "mine",
    name: "Mine",
    symbol: "◆",
    description: "A dark entrance cuts into the western hills.",
    color: 0x6c7180,
    exits: { east: "town" },
  },
  plains: {
    id: "plains",
    name: "Plains",
    symbol: "≋",
    description: "Open grasslands stretch toward the eastern sky.",
    color: 0xb59b4c,
    exits: { west: "town" },
  },
  lake: {
    id: "lake",
    name: "Lake",
    symbol: "≈",
    description: "Still blue water rests south of town.",
    color: 0x4b83a6,
    exits: { north: "town" },
  },
};
