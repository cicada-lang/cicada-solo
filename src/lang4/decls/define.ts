import { Decl } from "../decl"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type Define = Decl & {
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
      if (
        // TODO fix value_equal
        !ut.equal(
          JSON.stringify(infered.value_stack.values),
          JSON.stringify(expected.value_stack.values)
        )
      ) {
        const message = "Define.check fail"
        console.log(
          JSON.stringify(
            {
              message,
              infered: infered.value_stack.values,
              expected: expected.value_stack.values,
            },
            null,
            2
          )
        )
        throw new Error(message)
      }
    },
  }
}
