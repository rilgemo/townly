import Phaser from "phaser";

import { gameState } from "../state/GameState";
import { addDivider, colors, fonts } from "../ui/theme";

interface ArrivalStep {
  heading: string;
  speaker?: string;
  text: string;
  action: string;
}

const arrivalSteps: ArrivalStep[] = [
  {
    heading: "THE ROAD",
    text: "The road ends at a poor village. Smoke rises from a few worn roofs.\nA lone guard watches the gate.",
    action: "[ Approach the gate ]",
  },
  {
    heading: "AT THE GATE",
    speaker: "Village Guard",
    text: "Hold there, traveler. We do not see many strangers anymore.\nYou look like you have been walking for some time.",
    action: "[ Introduce yourself ]",
  },
  {
    heading: "AT THE GATE",
    speaker: "Village Guard",
    text: "There is not much here, but the village turns away no one in need.\nSpeak with the Chief. He will decide what can be done for you.",
    action: "[ Enter the village ]",
  },
  {
    heading: "THE VILLAGE",
    text: "The guard opens the old wooden gate. Inside, the village is quiet,\nbut not abandoned. A few people continue their work.",
    action: "[ Find the Village Chief ]",
  },
  {
    heading: "TOWN HALL",
    speaker: "Village Chief",
    text: "Welcome. We have little wealth, but an empty shelter is still standing.\nYou may use it until you find your footing.",
    action: "[ Accept the shelter ]",
  },
  {
    heading: "TOWN HALL",
    speaker: "Village Chief",
    text: "If you mean to stay, begin with simple work. Wood, stone, and herbs\ncan be gathered through the activities around our village.",
    action: "[ Begin life in Townly ]",
  },
];

export class ArrivalScene extends Phaser.Scene {
  private stepIndex = 0;

  constructor() {
    super("arrival");
  }

  create(): void {
    if (gameState.introduction.completed) {
      this.scene.start("town");
      return;
    }

    this.cameras.main.setBackgroundColor(colors.background);
    this.add.text(70, 35, "🏠  Townly", {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "34px",
    });
    this.add.text(890, 48, "ARRIVAL", {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    }).setOrigin(1, 0);
    addDivider(this, 82);

    this.renderStep();
  }

  private renderStep(): void {
    const step = arrivalSteps[this.stepIndex];

    this.children.removeAll();
    this.add.text(70, 35, "🏠  Townly", {
      color: colors.primary,
      fontFamily: fonts.title,
      fontSize: "34px",
    });
    this.add.text(890, 48, `ARRIVAL  ·  ${this.stepIndex + 1}/${arrivalSteps.length}`, {
      color: colors.secondary,
      fontFamily: fonts.body,
      fontSize: "13px",
    }).setOrigin(1, 0);
    addDivider(this, 82);

    this.add.text(70, 126, step.heading, {
      color: colors.accent,
      fontFamily: fonts.body,
      fontSize: "13px",
      fontStyle: "bold",
    });

    if (step.speaker) {
      this.add.text(70, 176, step.speaker, {
        color: colors.action,
        fontFamily: fonts.title,
        fontSize: "22px",
      });
    }

    this.add.text(70, step.speaker ? 224 : 176, step.text, {
      color: colors.primary,
      fontFamily: fonts.body,
      fontSize: "15px",
      lineSpacing: 10,
    });

    addDivider(this, 360);
    const action = this.add.text(70, 398, step.action, {
      color: colors.action,
      fontFamily: fonts.body,
      fontSize: "15px",
    }).setInteractive({ useHandCursor: true });

    action.on("pointerover", () => action.setColor(colors.primary));
    action.on("pointerout", () => action.setColor(colors.action));
    action.once("pointerdown", () => this.advance());
  }

  private advance(): void {
    if (this.stepIndex === 1) {
      gameState.introduction.guardMet = true;
    } else if (this.stepIndex === 2) {
      gameState.introduction.villageEntered = true;
    } else if (this.stepIndex === 4) {
      gameState.introduction.chiefMet = true;
      gameState.introduction.shelterReceived = true;
    }

    if (this.stepIndex === arrivalSteps.length - 1) {
      gameState.introduction.completed = true;
      this.scene.start("town");
      return;
    }

    this.stepIndex += 1;
    this.renderStep();
  }
}
