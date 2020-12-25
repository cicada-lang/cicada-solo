import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type JoJoComposeValue = Value & {
  kind: "JoJoComposeValue"
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
    kind: "JoJoComposeValue",
    array,
    env: the.env,
    mod: the.mod,
    refer: (world) => {
      for (const jo of array) {
        world = jo.compose(world)
      }
      return world
    },
    repr: () => "TODO",
  }
}
