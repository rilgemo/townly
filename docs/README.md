# Townly Documentation

Townly documentation is organized by how stable a decision should be and which question it answers.

## Manifesto — Why

`manifesto/` contains the project's design constitution.

- Changes should be rare and deliberate.
- Every feature and interface decision must respect the manifesto.
- Start with [Townly Design Manifesto v0.1](manifesto/design-manifesto.md).

## Vision — What

`vision/` describes the village, its people, and the intended progression experience.

- It may grow as Townly gains content.
- It describes what belongs in the game without prescribing code.
- Add a document only when a subject has a concrete direction worth preserving.

## Gameplay — How

`gameplay/` records accepted gameplay behavior such as exploration, resources, restoration, and buildings.

- It should describe implemented or approved rules.
- It may evolve through playtesting.
- Ideas that are not yet accepted remain in `ideas.md`.

## Implementation — Code

`implementation/` explains durable technical decisions such as GameState, UI presentation, and saving.

- It follows the design rather than defining it.
- It may be refactored whenever a simpler implementation serves the same experience.
- Do not add architecture documentation before the architecture actually exists.

## Governance — Review

`governance/` contains lightweight questions used before implementation.

- It protects the experience-first philosophy without defining code or architecture.
- Use the [Experience Review](governance/experience-review.md) to test a feature proposal before expanding its scope.

## Experience First Rule

Before implementation begins, every milestone or pull request must answer:

1. **Player Experience** — What will the player feel or understand for the first time?
2. **World Change** — What becomes different in the village because of it?

Describe the experience before listing implementation details.

Prefer milestone names that describe the player's journey—such as **Arrival**, **Belonging**, **Restoration**, and **Prosperity**—instead of system-oriented phase numbers.
