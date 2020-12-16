import { Jo } from "../jo"
import { World } from "../world"

export type Var = Jo & {
  name: string
}

export function Var(name: string): Var {
  return {
    name,
    composability: (possible_worlds) => possible_worlds.map(var_lookup(name)),
    cuttability: (possible_worlds) => possible_worlds.map(var_lookup(name)),
  }
}

export const var_lookup = (name: string) => (world: World) => {
  const value = world.value_table.lookup(name)
  if (value === undefined) throw new Error(`undefined name ${name}`)
  return value.comeout(world)
}
