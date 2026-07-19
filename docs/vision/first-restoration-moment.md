# First Restoration Moment

## Player Experience

The player should notice that living in Willow Village can leave a lasting mark on a real place.

This is not a task completion moment. The player has spent time learning the village, finding useful material through concrete actions, and noticing one of the small wounds everyone has learned to live around. They choose to mend it.

The intended feeling is:

> This place is different from when I arrived.

Not:

> I pressed the upgrade button.

## World Change

The Town Hall entrance begins with a heavy door hanging crooked in its frame and scraping against the stone threshold.

When the player has found enough usable wood and stone, they can brace the frame and steady the threshold. Afterwards:

- the door closes properly
- Town Hall describes a clear sign of care
- Town Square visibly reflects the straightened entrance
- the Village Chief recognizes the change

No new feature becomes available. The repaired door is itself the result.

## Why This Restoration Exists

The Town Hall door is deliberately small. It validates the complete restoration language before Townly attempts workshops, farms, inns, or other major places.

The proof is successful if existing player actions can create a persistent narrative change without requiring:

- a building system
- levels
- a construction menu
- a resource-cost panel
- a feature unlock

## Resource Relationship

The implementation uses existing Wood and Stone state. Internally, the repair requires 10 Wood and 5 Stone so current exploration and restoration balance remain functional.

The player-facing action does not present a shopping-style cost. Instead, observation reveals that sound timber and firm stone could steady the damaged frame. When enough useful material has been gathered, the player may choose to use it.

## Restoration Versus Upgrade

An upgrade increases an abstract value and usually exists to grant more power.

This restoration changes a remembered physical detail:

```text
Before:
The Town Hall door hangs loose and scrapes the threshold.

After:
The Town Hall door sits straight and closes properly again.
```

The village does not gain Town Hall Level 2. It gains a door that works.

## Completion Test

First Restoration Moment succeeds when:

- The damaged door is visible before repair.
- Existing meaningful actions still provide the required Wood and Stone.
- No inventory, storage, building, crafting, economy, time, or quest system is added.
- The repair consumes existing materials without a cost menu.
- The changed door remains visible in more than one village description.
- A resident naturally acknowledges the improvement.
- No player-facing text says unlocked, purchased, upgraded, or level increased.
