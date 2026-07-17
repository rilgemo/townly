export type NpcId = "guard" | "chief" | "lumberjack" | "miner";

export interface Npc {
  id: NpcId;
  icon: string;
  name: string;
  description: string;
}

export const npcs: Record<NpcId, Npc> = {
  guard: {
    id: "guard",
    icon: "🛡",
    name: "Village Guard",
    description: "Keeps watch over the village gate.",
  },
  chief: {
    id: "chief",
    icon: "👴",
    name: "Village Chief",
    description: "Maintains the village and its old records.",
  },
  lumberjack: {
    id: "lumberjack",
    icon: "🪓",
    name: "Lumberjack",
    description: "Works near the village edge and knows the forest paths.",
  },
  miner: {
    id: "miner",
    icon: "⛏",
    name: "Miner",
    description: "Lives near the blocked entrance to the old mine.",
  },
};
