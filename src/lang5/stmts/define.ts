import { Stmt } from "../stmt"
import { World } from "../world"
import { value_equal } from "../value"
import { TypeCheckError } from "../errors"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type Define = Stmt & {
  name: string
  pre: JoJo
  post: JoJo
  jojo: JoJo
}

export function Define(
  name: string,
  pre: JoJo,
  post: JoJo,
  jojo: JoJo
): Define {
  return {
    name,
    pre,
    post,
    jojo,
    assemble: (world) => world.mod_extend(name, { pre, post, jojo }),
    check: (world) => {
      const infered = jojo.jos_cut(pre.jos_compose(world))
      const expected = post.jos_compose(world)
      if (!ut.array_equal(infered.values, expected.values, value_equal)) {
        const infered_repr = infered.values
          .map((value) => value.repr())
          .join(" ")
        const expected_repr = expected.values
          .map((value) => value.repr())
          .join(" ")
        throw new TypeCheckError(
          ut.aline(`
            |Fail to define ${name}, because type check failed.
            |- infered  : ${infered_repr}
            |- expected : ${expected_repr}
            |`)
        )
      }
    },
  }
}
