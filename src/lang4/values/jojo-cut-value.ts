import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { World } from "../world"

export class JoJoCutValue implements Value {
  kind = "JoJoCutValue"
  array: Array<Jo>
  env: Env
  mod: Mod

  constructor(array: Array<Jo>, the: { env: Env; mod: Mod }) {
    this.array = array
    this.env = the.env
    this.mod = the.mod
  }

  refer(world: World): World {
    for (const jo of this.array) {
      world = jo.cut(world)
    }
    return world
  }
}
