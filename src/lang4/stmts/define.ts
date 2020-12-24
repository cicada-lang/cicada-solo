import { Stmt } from "../stmt"
import { World } from "../world"
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
      const infered = jojo.cut_jojo(pre.compose_jojo(world))
      const expected = post.compose_jojo(world)
      if (!ut.equal(infered.value_stack, expected.value_stack)) {
        const message = "Define.check fail"
        console.log({
          message,
          infered: infered.value_stack,
          expected: expected.value_stack,
        })
        throw new Error(message)
      }
    },
  }
}
