import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"

export type Define = Stmt & {
  name: string
  pre: JoJo
  post: JoJo
  jojo: JoJo
}

export function Define(the: {
  name: string
  pre: JoJo
  post: JoJo
  jojo: JoJo
}): Define {
  return {
    ...the,
    execute: (world) => {
      throw new Error("TODO")
    }
  }
}
