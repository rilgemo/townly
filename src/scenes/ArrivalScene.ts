import Phaser from "phaser";

import { gameState } from "../state/GameState";
import {
  addSectionTitle,
  columns,
  createTextAction,
  renderLayout,
} from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface PlaceContent {
  area: string;
  name: string;
  description: string;
  npcs: string[];
}

const places: Record<typeof gameState.introduction.currentPlace, PlaceContent> = {
  outskirts: {
    area: "Village Outskirts",
    name: "The Old Road",
    description: "You wake beside an unfamiliar road. The morning is quiet.\nA weathered wooden gate stands some distance ahead.",
    npcs: [],
  },
  gate: {
    area: "Village Outskirts",
    name: "Village Gate",
    description: "A weathered gate marks the village boundary.\nThe guard studies every traveler who approaches.",
    npcs: ["🛡 Village Guard"],
  },
  townSquare: {
    area: "Townly",
    name: "Town Square",
    description: "The village is quiet, but not abandoned.\nA few people continue their work among the old buildings.",
    npcs: ["🛡 Village Guard"],
  },
  townHall: {
    area: "Townly",
    name: "Town Hall",
    description: "The old hall has seen better years. A small fire burns within.\nThe Village Chief waits beside a table of village records.",
    npcs: ["👴 Village Chief"],
  },
};

export class ArrivalScene extends Phaser.Scene {
  private message = "You wake with dust on your clothes and no memory of this road.";

  constructor() {
    super("arrival");
  }

  create(): void {
    if (gameState.introduction.completed) {
      this.scene.start("town");
      return;
    }

    this.renderPlace();
  }

  private renderPlace(): void {
    this.children.removeAll();
    const place = places[gameState.introduction.currentPlace];
    renderLayout(
      this,
      gameState.knowledge.knowsVillage ? "Willow Village" : "Unknown",
      place.name,
      {
      nearbyPlaces: this.getNearbyPlaces(),
      },
    );

    this.add.text(columns.center, 60, place.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "25px",
    });
    this.add.text(columns.center, 102, place.description, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
      lineSpacing: 7,
    });

    addSectionTitle(this, columns.center, 176, "People Here");
    this.add.text(
      columns.center,
      202,
      place.npcs.length > 0 ? place.npcs.join("\n") : "No one is nearby.",
      {
        color: place.npcs.length > 0 ? colors.primary : colors.muted,
        fontFamily: fonts.body,
        fontSize: "13px",
        lineSpacing: 6,
      },
    );

    addSectionTitle(this, columns.center, 270, "What You Can Do");
    this.renderActions();

    addSectionTitle(this, columns.center, 414, "What Happened");
    this.add.text(columns.center, 440, this.message, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
      lineSpacing: 5,
    });
  }

  private renderActions(): void {
    const place = gameState.introduction.currentPlace;

    if (place === "outskirts") {
      createTextAction(this, columns.center, 302, "Look around", () => {
        gameState.introduction.lookedAround = true;
        this.message =
          "You notice a weathered wooden gate ahead. A guard stands beside it.";
        this.renderPlace();
      });
      createTextAction(this, columns.center, 332, "Approach the village gate", () => {
        gameState.introduction.currentPlace = "gate";
        this.message = "You follow the road to the gate.";
        this.renderPlace();
      });
      return;
    }

    if (place === "gate") {
      if (!gameState.introduction.guardMet) {
        createTextAction(this, columns.center, 302, "Speak with Village Guard", () => {
          gameState.introduction.guardMet = true;
          gameState.knowledge.knowsVillage = true;
          this.message =
            'Village Guard: "You are standing outside Willow Village. We turn away no one in need. Speak with the Chief." New knowledge: Willow Village.';
          this.renderPlace();
        });
      } else {
        createTextAction(this, columns.center, 302, "Enter the village", () => {
          gameState.introduction.villageEntered = true;
          gameState.introduction.currentPlace = "townSquare";
          this.message = "The guard opens the old wooden gate.";
          this.renderPlace();
        });
        createTextAction(this, columns.center, 332, "Speak with Village Guard", () => {
          this.message = 'Village Guard: "The Chief is waiting in the Town Hall."';
          this.renderPlace();
        });
      }
      return;
    }

    if (place === "townSquare") {
      createTextAction(this, columns.center, 302, "Visit the Town Hall", () => {
        gameState.introduction.currentPlace = "townHall";
        this.message = "You cross the square and enter the old hall.";
        this.renderPlace();
      });
      return;
    }

    if (!gameState.introduction.chiefMet) {
      createTextAction(this, columns.center, 302, "Speak with Village Chief", () => {
        gameState.introduction.chiefMet = true;
        gameState.introduction.shelterReceived = true;
        this.message =
          'Village Chief: "Use the empty shelter. You can find useful materials through work around the village."';
        this.renderPlace();
      });
      return;
    }

    createTextAction(this, columns.center, 302, "Begin life in Townly", () => {
      gameState.introduction.completed = true;
      this.scene.start("town");
    });
    createTextAction(this, columns.center, 332, "Speak with Village Chief", () => {
      this.message = 'Village Chief: "Start with simple work. The village will grow in time."';
      this.renderPlace();
    });
  }

  private getNearbyPlaces(): string[] {
    const place = gameState.introduction.currentPlace;
    if (place === "outskirts") {
      return gameState.introduction.lookedAround ? ["Village Gate"] : [];
    }
    if (place === "gate") {
      return gameState.knowledge.knowsVillage
        ? ["Old Road", "Town Square"]
        : ["Old Road"];
    }
    if (place === "townSquare") {
      return ["Village Gate", "Town Hall"];
    }
    return ["Town Square"];
  }
}
