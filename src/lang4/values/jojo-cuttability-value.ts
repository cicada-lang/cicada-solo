import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type JoJoCuttabilityValue = Value & {
  array: Array<Jo>
  env: Env
  mod: Mod
}

export function JoJoCuttabilityValue(
  array: Array<Jo>,
  the: {
    env: Env
    mod: Mod
  }
): JoJoCuttabilityValue {
  return {
    array,
    env: the.env,
    mod: the.mod,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.cuttability(world)
      }
      return world
    },
  }
}
