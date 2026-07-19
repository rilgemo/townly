import Phaser from "phaser";

import { npcs, type NpcId } from "../data/npcs";
import { gameState } from "../state/GameState";
import { saveGame } from "../systems/PersistenceSystem";
import {
  canRepairTownHallDoor,
  repairTownHallDoor,
} from "../systems/RestorationSystem";
import type { LocationId } from "../types/game";
import { columns, createTextAction, renderLayout } from "../ui/layout";
import { colors, fonts } from "../ui/theme";

interface TownPlace {
  name: string;
  description: string;
  npcIds: NpcId[];
}

const townPlaces: Record<typeof gameState.currentTownPlace, TownPlace> = {
  townSquare: {
    name: "Town Square",
    description: "Cooking smoke rises above a few roofs. Small gardens fill gaps between aging homes.\nNeighbors mend old tools and share what remains from carefully kept supplies.",
    npcIds: ["guard"],
  },
  townHall: {
    name: "Town Hall",
    description: "The hall contains village records and a long communal table.\nIts worn structure reflects the condition of the village.",
    npcIds: ["chief"],
  },
  shelter: {
    name: "Your Shelter",
    description: "A small abandoned room near the square. The floorboards are old,\nthe walls are worn, and the corners stand empty. It is dry enough to use.",
    npcIds: [],
  },
  villageEdge: {
    name: "Village Edge",
    description: "The northern cottages stand beside a wall of tangled growth.\nAn old working path disappears beneath the trees.",
    npcIds: ["woodsman"],
  },
  mineEntrance: {
    name: "Old Mine Entrance",
    description: "East of the square, broken timbers and fallen stone cover a tunnel.\nA small worker's hut remains beside the hillside.",
    npcIds: ["formerMiner"],
  },
  southRoad: {
    name: "The Old Road",
    description: "The road where you first arrived continues beyond the southern gate.\nWillow Village rests behind you; open country lies ahead.",
    npcIds: [],
  },
};

export class TownScene extends Phaser.Scene {
  private message = "The village moves quietly around you.";

  constructor() {
    super("town");
  }

  create(): void {
    this.renderTown();
  }

  private renderTown(): void {
    gameState.player.currentScene = "town";
    gameState.player.currentLocation = undefined;
    saveGame();
    this.children.removeAll();
    const place = townPlaces[gameState.currentTownPlace];
    renderLayout(this);

    this.add.text(columns.center, 46, place.name, {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "29px",
    });
    const description = this.getPlaceDescription(place);
    this.add.text(columns.center, 92, description, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "15px",
      lineSpacing: 10,
    });

    this.renderPeople(place.npcIds);
    this.renderPlaceActions();
    this.renderTravel();

    this.add.text(columns.center, 502, this.message, {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "12px",
      wordWrap: { width: 390 },
    });
  }

  private renderPeople(npcIds: NpcId[]): void {
    npcIds.forEach((npcId, index) => {
      const npc = npcs[npcId];
      const y = 178 + index * 52;
      this.add.text(columns.center, y, `${npc.icon} ${npc.name}`, {
        color: colors.secondary,
        fontFamily: fonts.body,
        fontSize: "13px",
      });
      this.add.text(columns.center + 158, y, npc.description, {
        color: colors.muted,
        fontFamily: fonts.body,
        fontSize: "11px",
      });
      createTextAction(this, columns.center, y + 24, `Speak with ${npc.name}`, () => {
        this.speakWith(npcId);
      });
    });
  }

  private renderPlaceActions(): void {
    const y = 270;

    if (gameState.currentTownPlace === "townSquare") {
      if (!gameState.knowledge.surveyedVillage) {
        createTextAction(this, columns.center, y, "Look around the square", () => {
          gameState.knowledge.surveyedVillage = true;
          this.message =
            "Trees crowd the north. A hill road runs east. Water glints west. The old gate opens south.";
          this.renderTown();
        });
      }
      createTextAction(this, columns.center, y + 28, "Step into the Town Hall", () => {
        gameState.currentTownPlace = "townHall";
        this.message = "You enter the old Town Hall.";
        this.renderTown();
      });
      createTextAction(this, columns.center, y + 56, "Return to your shelter", () => {
        gameState.currentTownPlace = "shelter";
        this.message = "You return to the room offered to you.";
        this.renderTown();
      });
      return;
    }

    if (gameState.currentTownPlace === "townHall") {
      this.renderTownHallAction(y);
      return;
    }

    if (gameState.currentTownPlace === "shelter") {
      createTextAction(this, columns.center, y, "Look around the empty room", () => {
        this.message =
          "Dust rests along the old floor. The room holds no furniture, only quiet and empty space.";
        this.renderTown();
      });
      createTextAction(this, columns.center, y + 28, "Rest against the wall", () => {
        this.message =
          "You sit against the worn wall for a while. Village sounds drift through the window.";
        this.renderTown();
      });
      return;
    }

    if (gameState.currentTownPlace === "villageEdge" && !gameState.knowledge.knowsForest) {
      createTextAction(this, columns.center, y, "Study the overgrown path", () => {
        gameState.knowledge.knowsForest = true;
        this.addKnownLocation("forest");
        this.message =
          "Beneath weeds and fallen branches, an old working path still leads into the forest.";
        this.renderTown();
      });
      return;
    }

    if (gameState.currentTownPlace === "mineEntrance" && !gameState.knowledge.knowsMine) {
      createTextAction(this, columns.center, y, "Examine the collapsed entrance", () => {
        gameState.knowledge.knowsMine = true;
        this.addKnownLocation("mine");
        this.message =
          "The main entrance is lost, but a narrow service passage remains between the stones.";
        this.renderTown();
      });
      return;
    }

    if (gameState.currentTownPlace === "southRoad") {
      createTextAction(this, columns.center, y, "Look beyond the village", () => {
        this.message =
          "The road crosses open land before fading toward the distant southern horizon.";
        this.renderTown();
      });
    }
  }

  private renderTownHallAction(y: number): void {
    if (gameState.restoration.townHallDoorRepaired) {
      return;
    }

    const knowsRequirements =
      gameState.knowledge.knowsWood && gameState.knowledge.knowsStone;
    const canRepair = canRepairTownHallDoor();
    createTextAction(
      this,
      columns.center,
      y,
      !knowsRequirements
        ? "Examine the crooked entrance door"
        : canRepair
          ? "Use the materials you found to mend the door"
          : "Consider how the loose door might be mended",
      () => {
        if (!knowsRequirements) {
          this.message =
            "The old hinges pull against rotten wood. Sound timber and firm stone could steady the frame.";
        } else if (!canRepair) {
          this.message =
            "You can see how the frame might be braced, but the usable pieces you carry are not yet enough.";
        } else if (repairTownHallDoor()) {
          this.message =
            "You brace the frame with usable wood and set loose stones beneath it. The Town Hall door closes properly again.";
        }
        if (gameState.restoration.townHallDoorRepaired) {
          this.renderTown();
          return;
        }
        this.renderTown();
      },
    );
  }

  private renderTravel(): void {
    const y = 370;
    this.add.text(columns.center, y - 24, "WAYS FROM HERE", {
      color: colors.muted,
      fontFamily: fonts.body,
      fontSize: "10px",
    });

    if (gameState.currentTownPlace === "townSquare") {
      createTextAction(
        this,
        columns.center,
        y,
        gameState.knowledge.knowsForest ? "Walk north to the forest path" : "Walk north",
        () => this.moveWithinVillage("villageEdge", "You follow the northern path between the cottages."),
      );
      createTextAction(
        this,
        columns.center,
        y + 26,
        gameState.knowledge.knowsMine ? "Walk east toward the old mine" : "Walk east",
        () => this.moveWithinVillage("mineEntrance", "You follow the eastern road toward the hills."),
      );
      createTextAction(
        this,
        columns.center,
        y + 52,
        gameState.knowledge.knowsLake ? "Walk west toward the lake" : "Walk west",
        () => {
          gameState.knowledge.knowsLake = true;
          this.scene.start("explore", { locationId: "lake" });
        },
      );
      createTextAction(this, columns.center, y + 78, "Walk south to the old road", () => {
        this.moveWithinVillage("southRoad", "You pass through the southern gate to the old road.");
      });
      return;
    }

    if (gameState.currentTownPlace === "villageEdge") {
      if (gameState.knowledge.knowsForest) {
        this.createTravelAction("forest", y, "Continue north into the forest");
      }
      createTextAction(this, columns.center, y + 30, "Walk south to the Town Square", () => {
        this.moveWithinVillage("townSquare", "You walk back toward the center of Willow Village.");
      });
      return;
    }

    if (gameState.currentTownPlace === "mineEntrance") {
      if (gameState.knowledge.knowsMine) {
        this.createTravelAction("mine", y, "Enter the remaining mine passage");
      }
      createTextAction(this, columns.center, y + 30, "Walk west to the Town Square", () => {
        this.moveWithinVillage("townSquare", "You follow the hill road back to the square.");
      });
      return;
    }

    if (gameState.currentTownPlace === "southRoad") {
      createTextAction(this, columns.center, y, "Walk north into Willow Village", () => {
        this.moveWithinVillage("townSquare", "You pass through the gate and return to the square.");
      });
      createTextAction(this, columns.center, y + 30, "Continue south along the road", () => {
        gameState.knowledge.knowsPlains = true;
        this.scene.start("explore", { locationId: "plains" });
      });
      return;
    }

    createTextAction(this, columns.center, y, "Step outside to the Town Square", () => {
      this.moveWithinVillage("townSquare", "You return to the Town Square.");
    });
  }

  private speakWith(npcId: NpcId): void {
    if (npcId === "guard") {
      this.message = this.getGuardMessage();
    } else if (npcId === "chief") {
      this.message = this.getChiefMessage();
    } else if (npcId === "woodsman") {
      gameState.villagePeople.woodsmanMet = true;
      this.message = gameState.restoration.townHallDoorRepaired
        ? 'Old Woodsman: "I saw the hall door close cleanly this morning. A small thing, perhaps—but small things are how a village begins to look cared for again."'
        : 'Old Woodsman: "That forest once kept every hearth warm. I cannot work it as I did, but I remember which wood burns clean and which paths stay dry."';
    } else {
      gameState.villagePeople.formerMinerMet = true;
      this.message = gameState.restoration.townHallDoorRepaired
        ? 'Former Miner: "That repaired door catches the eye. Reminds people this place is worn, not abandoned."'
        : 'Former Miner: "Stone from these tunnels built half the village. I watch the old entrance so its story does not disappear with the people who worked there."';
    }
    this.renderTown();
  }

  private createTravelAction(locationId: LocationId, y: number, label: string): void {
    createTextAction(this, columns.center, y, label, () => {
      this.scene.start("explore", { locationId });
    });
  }

  private moveWithinVillage(
    place: typeof gameState.currentTownPlace,
    message: string,
  ): void {
    gameState.currentTownPlace = place;
    this.message = message;
    this.renderTown();
  }

  private addKnownLocation(locationId: LocationId): void {
    if (!gameState.discoveredLocations.includes(locationId)) {
      gameState.discoveredLocations.push(locationId);
    }
  }

  private getGuardMessage(): string {
    if (gameState.villagePeople.woodsmanMet || gameState.villagePeople.formerMinerMet) {
      return 'Village Guard: "You are finding your way around. People have started to recognize you."';
    }
    return 'Village Guard: "Settling in? The room near the square should keep the rain out."';
  }

  private getChiefMessage(): string {
    if (gameState.restoration.townHallDoorRepaired) {
      return 'Village Chief: "I had forgotten that door could close without a shoulder against it. The hall already feels cared for again."';
    }
    if (gameState.discoveredLocations.includes("deepForest")) {
      return 'Village Chief: "You have learned paths even some of us had forgotten. Willow Village is fortunate you stayed."';
    }
    if (gameState.villagePeople.woodsmanMet && gameState.villagePeople.formerMinerMet) {
      return 'Village Chief: "You are beginning to understand what this village once was."';
    }
    return 'Village Chief: "We have lasted on small gardens, careful stores, and neighbors sharing what they can. I keep the records so we do not forget how."';
  }

  private getPlaceDescription(place: TownPlace): string {
    if (gameState.currentTownPlace === "townSquare") {
      return gameState.restoration.townHallDoorRepaired
        ? `${place.description}\nThe Town Hall remains old, but its mended door makes it feel less forgotten.`
        : `${place.description}\nThe Town Hall entrance hangs crooked, showing years of quiet neglect.`;
    }
    if (gameState.currentTownPlace === "townHall") {
      return gameState.restoration.townHallDoorRepaired
        ? `${place.description}\nThe door closes normally now. The hall remains worn, but it is usable and cared for.`
        : `${place.description}\nThe frame is broken and the heavy door scrapes the threshold instead of closing.`;
    }
    return place.description;
  }
}
