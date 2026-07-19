export type NpcId = "guard" | "chief" | "woodsman" | "formerMiner";

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
    description: "Keeps the village records, shared stores, and long memory.",
  },
  woodsman: {
    id: "woodsman",
    icon: "🪓",
    name: "Old Woodsman",
    description: "Once supplied firewood; now preserves knowledge of the forest.",
  },
  formerMiner: {
    id: "formerMiner",
    icon: "⛏",
    name: "Former Miner",
    description: "Once cut village stone; now keeps the mine's history from vanishing.",
  },
};
