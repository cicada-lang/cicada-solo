import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

export type ArrowValue = Value & {
  kind: "ArrowValue"
  pre: Array<Jo>
  post: Array<Jo>
  env: Env
  mod: Mod
}

export function ArrowValue(
  pre: Array<Jo>,
  post: Array<Jo>,
  the: {
    env: Env
    mod: Mod
  }
): ArrowValue {
  return {
    kind: "ArrowValue",
    pre,
    post,
    env: the.env,
    mod: the.mod,
    refer: (world) => {
      throw new Error("TODO")
    },
    repr: () => {
      const pre_repr = "[ " + pre.map((jo) => jo.repr()).join(" ") + " ]"
      const post_repr = "[ " + post.map((jo) => jo.repr()).join(" ") + " ]"
      return "#arrow " + pre_repr + post_repr
    },
  }
}
