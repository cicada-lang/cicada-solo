import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"

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
    execute: (world) => world.mod_extend(name, { pre, post, jojo }),
  }
}
