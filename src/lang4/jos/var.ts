import { Jo } from "../jo"
import { World } from "../world"

export class Var implements Jo {
  kind = "Var"

  constructor(public name: string) {}

  compose = var_lookup(this.name)
  cut = var_lookup(this.name)
}

const var_lookup = (name: string) => (world: World) => {
  const value = world.env.lookup(name) || world.mod.lookup_value(name)
  if (value === undefined) throw new Error(`undefined name ${name}`)
  return value.refer(world)
}
