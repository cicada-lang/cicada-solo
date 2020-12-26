import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type JoJoCutValue = Value & {
  kind: "JoJoCutValue"
  array: Array<Jo>
  env: Env
  mod: Mod
}

export function JoJoCutValue(
  array: Array<Jo>,
  the: {
    env: Env
    mod: Mod
  }
): JoJoCutValue {
  return {
    kind: "JoJoCutValue",
    array,
    env: the.env,
    mod: the.mod,
    refer: (world) => {
      for (const jo of array) {
        world = jo.cut(world)
      }
      return world
    },
    repr: () =>
      "(#cut " + "[" + array.map((jo) => jo.repr()).join(" ") + "]" + ")",
  }
}
