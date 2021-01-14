import { Jo } from "../jo"
import { World } from "../world"
import { TypeValue } from "../values"
import { ArrowValue } from "../values"
import { JoJo } from "./jojo"

export type Arrow = Jo & {
  kind: "Arrow"
  pre: JoJo
  post: JoJo
}

export function Arrow(pre: JoJo, post: JoJo): Arrow {
  return {
    kind: "Arrow",
    pre,
    post,
    compose: (world) =>
      world.value_stack_push(
        ArrowValue(pre, post, {
          env: world.env,
          mod: world.mod,
        })
      ),
    repr: () => "[ " + pre.repr() + " -> " + post.repr() + " ]",
  }
}
