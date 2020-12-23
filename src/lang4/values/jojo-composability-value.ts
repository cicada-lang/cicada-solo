import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type JoJoComposabilityValue = Value & {
  array: Array<Jo>
  env: Env
  mod: Mod
}

export function JoJoComposabilityValue(
  array: Array<Jo>,
  the: {
    env: Env
    mod: Mod
  }
): JoJoComposabilityValue {
  return {
    array,
    env: the.env,
    mod: the.mod,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.composability(world)
      }
      return world
    },
  }
}
