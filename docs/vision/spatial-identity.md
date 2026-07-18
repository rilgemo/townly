# Spatial Identity

## Player Experience

The player should feel physically present in Willow Village: standing somewhere, noticing what lies in each direction, and deciding where to walk.

The village is not a location menu. It is a small world the player gradually learns.

## World Change

As the player observes and travels, anonymous directions gain identity:

- North becomes the old Forest path.
- East becomes the road to the abandoned Mine.
- West becomes the lakeshore.
- South remains the old road leading beyond Willow Village.

The geography does not unlock into existence. The player learns how its places relate to one another.

## Village Structure

```text
                 Forest
                    ↑

Lake  ←  Willow Village  →  Mine / Hills

                    ↓
             Old Road / Outside
```

Town Square is the village center. Town Hall and Your Shelter are places adjoining village life rather than entries in a global building list.

## Interaction Language

Three forms of interaction remain distinct:

- **People** — speak with residents present at the current place.
- **Actions** — observe, examine, rest, or work with the immediate environment.
- **Travel** — move in a physical direction from the current place.

This separation is implemented with direct place-state conditions, not a map or navigation engine.

## Completion Test

Spatial Identity succeeds when:

- Town Square offers north, east, south, and west movement.
- Unknown directions exist before their destination names are shown.
- Forest is reached through the northern Village Edge.
- Mine is reached through the eastern Old Mine Entrance.
- Lake is reached by walking west.
- The southern road leads back toward the outside world and plains.
- Deep Forest is reached from Forest, not from a global place list.
