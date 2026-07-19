# Restoration Model

## Player Experience

The player gradually understands that Willow Village is not incomplete because it was never built. It is diminished because parts of its former life have been lost.

Restoration should feel like recognizing what a place once meant, helping it become usable again, and watching village life return around it.

The player is not building a settlement from nothing. The player is helping Willow Village remember what it once was.

## World Change

A restored place recovers a possibility for the whole village.

- A restored blacksmith means tools can be made and repaired locally again.
- A restored carpenter's workshop means knowledge of working with wood has returned.
- A restored farm means the village can depend less on outside supplies.
- A restored inn means travelers have a reason to stop in Willow Village again.

These are examples of meaning, not approved systems or implementation commitments.

The player-facing result should describe life returning:

> Smoke rises from the old chimney again.

It should not announce:

> New feature unlocked: Blacksmith.

## Restoration Is Not Construction

**Restoration ≠ Construction.**

Construction says:

> I created something new because I wanted its feature.

Restoration says:

> This place once mattered. I helped it matter again.

The difference is historical and social, not cosmetic. A restored building already has a location, traces of a former purpose, people who remember it, and a reason its absence changed village life.

## Places, Memory, and People

Abandoned places should not begin as entries in a building catalogue.

They exist physically before the player understands them. Residents may remember:

- who worked there
- what the place contributed
- why its use ended
- what returning activity might mean for the village

NPC memories provide context, concern, and continuity. They do not function as feature buttons or recipe vendors.

Restoration becomes meaningful when three things meet:

1. The player has encountered the physical place.
2. Someone or something reveals its history.
3. The player's actions make a future possible there again.

## Conceptual Restoration States

These states define future design language only. They are not implemented state machines.

### Abandoned

- The place exists physically.
- Its former activity has stopped.
- Its purpose may be unclear to the player.
- The village lives with its absence.

### Recognized

- The player learns what the place once was.
- Its relationship to residents and village life becomes understood.
- The player can imagine what its return would change.

### Restored

- The place becomes usable again through meaningful player contribution.
- The result appears as a physical and narrative change in Willow Village.
- Restoration recovers a possibility; it does not merely increase a level.

### Active

- Residents begin using the place naturally.
- New dialogue, routines, needs, or opportunities may emerge from village life.
- Activity demonstrates the result without relying on an unlock notification.

## Design Constraints

Future restoration work should avoid defaulting to:

- building menus
- construction queues
- feature unlock banners
- production chains
- abstract building levels
- NPCs whose only purpose is granting systems

Implementation may use internal flags or state names, but player-facing language must describe what changed in the world.

## Completion Test

A future restoration succeeds when:

- The player knew the place before restoring it.
- Its former purpose was connected to village history.
- Materials and actions have an understandable relationship to the work.
- Residents acknowledge or use the changed place naturally.
- Willow Village gains a recovered way of living.
- The result feels like revival, not feature acquisition.

This milestone defines the model only. It does not implement blacksmithing, carpentry, farming, an inn, crafting, economy, visitors, production, or any building system.
