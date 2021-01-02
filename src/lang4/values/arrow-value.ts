import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { JoJo } from "../jos"

export type ArrowValue = Value & {
  kind: "ArrowValue"
  pre: JoJo
  post: JoJo
  env: Env
  mod: Mod
}

export function ArrowValue(
  pre: JoJo,
  post: JoJo,
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
    execute: (world) =>
      post.jos_compose(world.value_stack_match_values(pre.collect_values())),
    repr: () => "#arrow " + pre.repr() + " " + post.repr(),
  }
}
