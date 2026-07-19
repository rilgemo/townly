# Persistence Foundation

## Purpose

Townly uses browser-local persistence so Willow Village remembers lasting player and world changes after the page closes.

Persistence is infrastructure, not gameplay. It does not introduce save slots, accounts, cloud storage, or a backend.

## Storage

The current implementation uses `localStorage` with the key `townly.save`.

Each save is wrapped in a versioned envelope:

```json
{
  "version": 1,
  "timestamp": "2026-07-19T00:00:00.000Z",
  "gameState": {}
}
```

The timestamp records when the save was written. It does not implement game time or offline progress.

## Persisted State

The complete current `GameState` is saved, including:

- current scene and explored location
- current place within Willow Village
- introduction and shelter state
- known places, materials, and village knowledge
- carried Wood, Stone, and Herb
- exploration action counts and Deep Forest discovery
- resident interaction flags
- Town Hall door restoration

No inventory or `items[]` structure is introduced.

## Save Behavior

The game loads automatically before Phaser starts.

Current scenes save automatically when they render after meaningful state changes, including movement, observation, resident interaction, material findings, discoveries, and restoration.

The interface also provides lightweight text actions:

- Save Game
- Load Game
- Reset Game

Reset removes the local save and restores a fresh initial `GameState`.

## Validation and Compatibility

Only save version `1` is currently accepted.

Loaded data is checked for the current required state shape and valid primitive values. Invalid JSON, unsupported versions, missing fields, invalid places, and invalid material values are discarded safely. Townly falls back to a fresh game rather than crashing.

Future save format changes must increment the version and either provide an explicit migration or intentionally fall back to a new game.

## Non-Goals

Persistence Foundation does not add:

- save slots
- cloud saves
- accounts
- backend storage
- offline progression
- inventory
- database models
- gameplay mechanics
