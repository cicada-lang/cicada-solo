import { World } from "../world"

export type PossibleWorlds = {
  array: Array<World>
  map: (f: (world: World) => World) => PossibleWorlds
  flat_map: (f: (world: World) => PossibleWorlds) => PossibleWorlds
}

export function PossibleWorlds(array: Array<World>): PossibleWorlds {
  return {
    array,
    map: (f) => PossibleWorlds(array.map(f)),
    flat_map: (f) => PossibleWorlds(array.flatMap((world) => f(world).array)),
  }
}
