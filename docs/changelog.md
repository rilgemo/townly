# Changelog

Notable project changes are recorded here.

## Unreleased

### Added

- Townly Design Manifesto v0.1 as the reference for future product decisions.
- Four-layer documentation guide and Experience First development rule.
- Pull request template centered on player experience and world change.
- Arrival milestone polish with observation-first pacing and natural village introduction.
- Arrival vision document recording player experience and completion criteria.
- Belonging milestone with Your Shelter as a personal village place.
- State-based Guard and Village Chief recognition without relationship systems.
- Restoration Foundations reframing the Old Woodsman and Former Miner as witnesses of village history.
- Player-observed Forest and Mine access independent of NPC permission.
- Spatial Identity milestone with Town Square as a four-direction village center.
- Separate people, local actions, and directional travel presentation.
- Deep Forest reached through Forest rather than a global location list.
- Meaningful Actions milestone replacing fixed location payouts with concrete choices.
- Separate fallen Wood, wild Herb, and Mine rubble interactions.
- Shelter Identity milestone establishing an empty lived space rather than a storage or upgrade menu.
- Simple shelter observation and rest actions without furniture or housing systems.
- Restoration Model vision defining restoration as recovered village life rather than construction.
- Conceptual Abandoned, Recognized, Restored, and Active place states without implementation.
- First Restoration Moment replacing Town Hall levels with one persistent repaired door.
- Town Square, Town Hall, and Village Chief responses reflecting the visible repair.
- Restoration Recognition through distinct Old Woodsman and Former Miner observations.
- Refined Town Square and Town Hall descriptions emphasizing care rather than completion.
- Versioned localStorage persistence for current player, world, knowledge, people, and restoration state.
- Automatic startup loading, state-change saving, and Save/Load/Reset text actions.
- Invalid save validation with safe fresh-game fallback.
- Confirmed Reset Game flow that clears local progress and reloads a clean Arrival state.
- Initial Phaser, Vite, and TypeScript project structure.
- Starter town scene.
- Clickable travel from Town to Forest, Mine, Plains, and Lake.
- Location data and a shared exploration scene with return travel.
- Ten-second Forest and Mine material-finding actions.
- In-memory player and Wood, Stone, and Herb state shown in Town.
- Town Hall repair costing 10 Wood and 5 Stone, raising Town to level 2.
- Minimalist text-driven interface replacing the prototype map cards.
- Lightweight emoji anchors for resources, locations, and the Town Hall.
- Deep Forest discovery after three completed Forest actions.
- Discovery feedback in the exploration log and unlocked Town location list.
- First-time arrival flow through the Village Guard and Village Chief.
- Temporary shelter and basic gathering introduction.
- Three-column text RPG layout for town, place information, and area context.
- Place-based arrival interactions replacing the linear introduction sequence.
- Contextual action lists generated from the current place state.
- Lumberjack interaction at the Village Edge unlocking Forest access.
- Miner interaction at the Old Mine Entrance unlocking Mine access.
- Player-centric left column for identity, condition, carried resources, and known information.
- World-context right column with area, time, weather, and nearby places.
- Town Hall represented as an enterable place with building details shown only inside.
- Knowledge-driven interface hiding unknown areas, places, and resources.
- Old Road observation and Village Guard reveal flow for Willow Village.
- Resource knowledge revealed through first collection.
- Narrative-first panel language centered on You, Around You, and current experience.
- Empty system-style sections hidden until they contain naturally known information.
- Invisible-interface presentation with no panel borders or repeated place labels.
- Scene descriptions promoted above secondary people, choices, and event text.
- Lightweight roadmap, ideas, mechanics, and changelog documents.
- GitHub Actions build workflow.
