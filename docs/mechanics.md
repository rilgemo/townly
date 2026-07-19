# Mechanics

This document records gameplay rules that are implemented or approved for implementation.

## Approved

### Core Loop

1. Explore a surrounding region.
2. Discover resources and encounters.
3. Return resources to town.
4. Upgrade the town.
5. Unlock new exploration opportunities.

## Implemented

- The player can travel from Town to four surrounding locations and return.
- Searching Forest fallen branches takes 10 seconds and finds 3 Wood.
- Examining Forest wild plants takes 10 seconds and finds 1 Herb.
- Searching Mine rubble takes 10 seconds and finds 2 Stone.
- Resources remain in memory for the current browser session.
- Repairing the Town Hall costs 10 Wood and 5 Stone.
- The first Town Hall repair raises the Town from level 1 to level 2.
- Completing three Forest actions reveals the hidden route to Deep Forest.
- Deep Forest is added to the Town location list when discovered.
- A new player arrives outside the village, meets the Village Guard, and is admitted through the gate.
- The Village Chief provides temporary shelter and introduces basic gathering work.
- The arrival sequence advances through places and contextual NPC actions rather than a linear dialogue chain.
- The player recognizes the old Forest path by examining it at the Village Edge.
- The player finds a remaining Mine passage by examining the abandoned entrance.
- The Old Woodsman and Former Miner explain what these places once meant to Willow Village; they do not grant access.
- Buildings are presented as places; Town Hall condition and upgrade actions appear only while inside it.
- Village name, nearby places, resource names, and travel actions appear only after the player learns or observes them.
- Looking around reveals local possibilities; the Village Guard reveals the name Willow Village.
- A resource first appears in the player panel after it has been collected.
- Interface language describes the player's experience rather than exposing RPG system categories.
- Empty interface regions remain empty; no placeholder content is shown solely to fill the layout.
- Town Square is Willow Village's spatial center, with north, east, south, and west travel choices.
- Direction labels reveal known destinations only after the player has observed them.
- People, local actions, and travel are presented as separate kinds of interaction.
- Places provide opportunities; specific player actions determine which materials are found.
- Searching fallen branches provides Wood without implying tree cutting.
- Examining wild plants provides Herb separately from Wood gathering.
- Searching Mine rubble provides Stone without treating the Mine itself as a reward source.

## Design Principle

Townly progression is place-first: Town → Exploration → Growth.

The interface presents Townly as a readable town record and adventure log rather than a graphical RPG map.
