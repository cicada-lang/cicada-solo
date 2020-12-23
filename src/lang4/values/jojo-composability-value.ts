import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"

export type JoJoComposabilityValue = Value & {
  array: Array<Jo>
  env: Env
}

export function JoJoComposabilityValue(
  array: Array<Jo>,
  env: Env
): JoJoComposabilityValue {
  return {
    array,
    env,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.composability(world)
      }
      return world
    },
  }
}
