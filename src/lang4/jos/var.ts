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
    repr: () => name,
  }
}

const var_lookup = (name: string) => (world: World) => {
  const local_value = world.env.lookup(name)
  if (local_value) return world.value_stack_push(local_value)
  const global_value = world.mod.lookup_value(name)
  if (global_value === undefined) {
    console.log(world)
    throw new Error(`undefined name ${name}`)
  }
  return global_value.refer!(world)
}
