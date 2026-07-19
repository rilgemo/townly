import Phaser from "phaser";

import { gameState } from "../state/GameState";
import { saveGame } from "../systems/PersistenceSystem";
import {
  columns,
  createTextAction,
  renderLayout,
} from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface PlaceContent {
  name: string;
  description: string;
  npcs: string[];
}

const places: Record<typeof gameState.introduction.currentPlace, PlaceContent> = {
  outskirts: {
    name: "The Old Road",
    description: "You wake beside an unfamiliar road. The morning is cool and quiet.\nTall grass bends in the breeze. You do not recognize the surroundings.",
    npcs: [],
  },
  gate: {
    name: "Village Gate",
    description: "A weathered gate marks the village boundary.\nThe guard studies every traveler who approaches.",
    npcs: ["🛡 Village Guard\nThe old guard quietly watches the road."],
  },
  townSquare: {
    name: "Town Square",
    description: "The village is quiet, but not abandoned.\nA few people continue their work among the old buildings.",
    npcs: ["🛡 Village Guard\nHe keeps one eye on the village gate."],
  },
  townHall: {
    name: "Town Hall",
    description: "The old hall has seen better years. A small fire burns within.\nThe Village Chief waits beside a table of village records.",
    npcs: ["👴 Village Chief\nHe waits beside a table of worn village records."],
  },
};

export class ArrivalScene extends Phaser.Scene {
  private message = "You wake with dust on your clothes and no memory of this road.";

  constructor() {
    super("arrival");
  }

  create(): void {
    if (gameState.introduction.completed) {
      if (
        gameState.player.currentScene === "explore" &&
        gameState.player.currentLocation
      ) {
        this.scene.start("explore", {
          locationId: gameState.player.currentLocation,
        });
      } else {
        this.scene.start("town");
      }
      return;
    }

    this.renderPlace();
  }

  private renderPlace(): void {
    gameState.player.currentScene = "arrival";
    gameState.player.currentLocation = undefined;
    saveGame();
    this.children.removeAll();
    const place = places[gameState.introduction.currentPlace];
    const description =
      gameState.introduction.currentPlace === "outskirts" &&
      gameState.introduction.lookedAround
        ? "The old road runs toward a weathered wooden gate.\nSomeone appears to be standing watch beside it."
        : place.description;
    renderLayout(this, {
      nearbyPlaces: this.getNearbyPlaces(),
    });

    this.add.text(columns.center, 60, place.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "29px",
    });
    this.add.text(columns.center, 102, description, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "15px",
      lineSpacing: 10,
    });

    if (place.npcs.length > 0) {
      this.add.text(columns.center, 210, place.npcs.join("\n"), {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "13px",
        lineSpacing: 6,
      });
    }

    this.renderActions();

    this.add.text(columns.center, 438, this.message, {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
      lineSpacing: 5,
    });
  }

  private renderActions(): void {
    const place = gameState.introduction.currentPlace;

    if (place === "outskirts") {
      if (!gameState.introduction.lookedAround) {
        createTextAction(this, columns.center, 302, "Look around", () => {
          gameState.introduction.lookedAround = true;
          this.message =
            "Beyond the grass, the road leads to a wooden gate. A solitary figure stands nearby.";
          this.renderPlace();
        });
        return;
      }

      createTextAction(this, columns.center, 302, "Walk toward the gate", () => {
        gameState.introduction.currentPlace = "gate";
        this.message =
          "Your footsteps carry along the old road. The figure at the gate turns to face you.";
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
            'Village Guard: "You are standing outside Willow Village. We have little, but we turn away no one in need. Speak with the Chief inside."';
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
          'Village Chief: "There is a small room near the square. It has been empty for years. You may use it while you decide your next step."';
        this.renderPlace();
      });
      return;
    }

    createTextAction(this, columns.center, 302, "Step back into the village", () => {
      gameState.introduction.completed = true;
      this.scene.start("town");
    });
    createTextAction(this, columns.center, 332, "Speak with Village Chief", () => {
      this.message =
        'Village Chief: "The room is yours for as long as you need it. When you are ready, speak with the people who work around the village."';
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
