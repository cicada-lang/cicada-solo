import { Jo } from "../jo"
import { World } from "../world"

export type Var = Jo & {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
    compose: var_lookup(name),
    cut: var_lookup(name),
  }
}

const var_lookup = (name: string) => (world: World) => {
  const value = world.env.lookup(name)
  if (value === undefined) throw new Error(`undefined name ${name}`)
  if (value.refer) return value.refer(world)
  return world.push(value)
}
