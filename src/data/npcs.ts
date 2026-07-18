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
    description: "Maintains the village and its old records.",
  },
  woodsman: {
    id: "woodsman",
    icon: "🪓",
    name: "Old Woodsman",
    description: "Remembers when the forest path still sustained the village.",
  },
  formerMiner: {
    id: "formerMiner",
    icon: "⛏",
    name: "Former Miner",
    description: "Keeps watch near tunnels abandoned years ago.",
  },
};
