import { Jo } from "../jo"
import { World } from "../world"
import { JoJoComposeValue } from "../values/jojo-compose-value"
import { JoJoCutValue } from "../values/jojo-cut-value"
import { TypeValue } from "../values/type-value"
import { ArrowValue } from "../values/arrow-value"

export type Arrow = Jo & {
  kind: "Arrow"
  pre: Array<Jo>
  post: Array<Jo>
}

export function Arrow(pre: Array<Jo>, post: Array<Jo>): Arrow {
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
    cut: (world) => world.value_stack_push(TypeValue),
    repr: () => {
      const pre_repr = "[ " + pre.map((jo) => jo.repr()).join(" ") + " ]"
      const post_repr = "[ " + post.map((jo) => jo.repr()).join(" ") + " ]"
      return "@arrow " + pre_repr + " " + post_repr
    },
  }
}
