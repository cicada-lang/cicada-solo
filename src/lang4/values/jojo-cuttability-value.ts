import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"

export type JoJoCuttabilityValue = Value & {
  array: Array<Jo>
  env: Env
}

export function JoJoCuttabilityValue(
  array: Array<Jo>,
  env: Env
): JoJoCuttabilityValue {
  return {
    array,
    env,
    comeout: (world) => {
      for (const jo of array) {
        world = jo.cuttability(world)
      }
      return world
    },
  }
}
