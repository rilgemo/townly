# Interface Atmosphere

## Player Experience

Townly should feel like observing and inhabiting a place, not operating a character management screen.

The player is already the viewpoint. The interface does not need to name them, summarize their identity, or frame their experience as a status panel.

## Observation, Not Statistics

Each column supports a different kind of attention:

- The left holds physical belongings and places genuinely learned.
- The center remains the primary experience: the current place, people, choices, and recent events.
- The right provides atmosphere and spatial awareness.

No column should resemble a character sheet, global management dashboard, or decorative environmental HUD.

## Information Through Discovery

Information appears only when experience gives it meaning.

- A carried material appears because the player physically has some.
- A known place appears because the player has discovered or learned it.
- Empty knowledge sections remain absent.
- Unknown places are not listed as hidden entries.

The interface should never know more than the player, and it should not display zero-value categories merely because the underlying state exists.

## Environmental Context

Townly does not display time or weather labels without time or weather gameplay.

Atmosphere is expressed as observation:

> The smell of cooking smoke drifts from nearby houses.

> Cool air slips between fallen stones.

> The old hall feels slightly less forgotten.

These details locate the player emotionally and spatially without pretending that a simulation exists behind them.

## Persistence Controls

Saving, loading, and resetting remain available, but they do not occupy the main experience as permanent game actions.

A minimal settings entry contains these controls. Persistence remains unchanged; only its presentation is quieter.

## Design Boundary

Interface atmosphere does not change:

- GameState
- persistence behavior
- restoration state
- exploration rewards
- NPC state
- progression rules

Future interface work should remove framing before adding decoration. If a label describes a software system rather than something the player notices, it should be questioned.

## Completion Test

Interface Atmosphere succeeds when:

- The player sees the place before seeing the interface structure.
- No `You` header or player-status summary is present.
- Carried materials and known places appear only when meaningful.
- Environmental text describes context instead of displaying decorative time and weather values.
- Persistence controls remain accessible without dominating the main screen.
