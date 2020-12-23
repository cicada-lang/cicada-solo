import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type JoJoComposeValue = Value & {
  array: Array<Jo>
  env: Env
  mod: Mod
}

export function JoJoComposeValue(
  array: Array<Jo>,
  the: {
    env: Env
    mod: Mod
  }
): JoJoComposeValue {
  return {
    array,
    env: the.env,
    mod: the.mod,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.compose(world)
      }
      return world
    },
  }
}
