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
- Forest exploration takes 10 seconds and grants 3 Wood and 1 Herb.
- Mine exploration takes 10 seconds and grants 2 Stone.
- Resources remain in memory for the current browser session.
- Repairing the Town Hall costs 10 Wood and 5 Stone.
- The first Town Hall repair raises the Town from level 1 to level 2.
- Completing Forest exploration three times reveals Deep Forest.
- Deep Forest is added to the Town location list when discovered.
- A new player arrives outside the village, meets the Village Guard, and is admitted through the gate.
- The Village Chief provides temporary shelter and introduces basic gathering work.

## Design Principle

Townly progression is place-first: Town → Exploration → Growth.

The interface presents Townly as a readable town record and adventure log rather than a graphical RPG map.
