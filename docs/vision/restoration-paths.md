# Restoration Paths

## Player Experience

The player begins to understand that Willow Village has not merely lost buildings. It has lost ways of sustaining daily life.

Restoration paths describe those missing capabilities without turning them into a feature list. They give the player reasons to care about old places, resident memories, and the village's possible future.

## World Change

A restoration path succeeds when a village ability returns to ordinary use.

- **Woodworking** means residents can shape and repair useful wooden objects locally again.
- **Metalworking** means tools and fittings can be maintained instead of slowly wearing beyond use.
- **Food production** means the village can grow beyond small gardens and fragile stored supplies.
- **Hospitality** means Willow Village can offer travelers a reason to stop, rest, and remember the road through it.

These are possible directions, not implemented systems, buildings, or promises of production mechanics.

## Capability States

Each path may be understood through four descriptive states. These are design language only, not a generic state machine.

### Lost

The capability no longer supports village life. Physical traces and partial habits may remain, but Willow Village depends on workarounds or outside help.

### Remembered

Residents and places reveal what the capability once meant. The player understands its history and why its absence matters.

### Restored

Meaningful actions make the capability possible again. A place, practice, or relationship has changed enough for the old work to return.

### Active

The capability becomes visible in ordinary village life. Residents use it naturally, and the village is less fragile because it exists.

Player-facing language should describe evidence of life rather than announce a state transition.

Prefer:

> A newly fitted handle rests beside the repaired shutters.

Avoid:

> Woodworking upgraded to Active.

## People and Memory

Residents connect restoration paths to lived history. They are witnesses and participants, not progression switches.

- The **Old Woodsman** remembers forest materials and the workshop hands that once shaped them into useful objects.
- The **Former Miner** preserves knowledge of stone, old tools, and the smithing work that kept village labor possible.
- The **Village Chief** holds the larger memory of workshops, fields, shared stores, and hospitality as parts of one village life.

No resident grants a capability through conversation alone. Their memories help the player recognize what has been lost and what might matter again.

## Paths Are Not Menus

Restoration paths should emerge from places, observations, needs, and relationships. They must not become a technology tree or a list of locked buildings.

The player should encounter evidence first:

- worn wooden objects that can no longer be properly replaced
- metal tools kept in use through increasingly temporary repairs
- small gardens that sustain life but cannot provide security
- empty rooms that remember when travelers stopped in Willow Village

Only then should the village's former capability become understood.

## Design Boundary

This foundation does not add:

- workshops, smithies, farms, or inns
- crafting or production systems
- economy or numerical output
- new resources
- recruitment or professions
- skills or capability state code

Future implementation must answer one experience question at a time. A path belongs in Townly only when its return makes Willow Village feel more alive, not merely more functional.

## Completion Test

Restoration Paths Foundation succeeds when:

- The four missing capabilities have distinct human meaning.
- Their possible return is connected to village history and daily life.
- Existing residents can reference that history without acting as unlock gates.
- No building, production, economy, or generic capability system has been introduced.
- Restoration still reads as recovering a way of living rather than unlocking a game feature.
