import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type Show = Stmt & {
  jojo: JoJo
}

export function Show(jojo: JoJo): Show {
  return {
    jojo,
    assemble: (world) => world,
    check: (world) => jojo.cut_jojo(world),
    output: (world) => {
      const { value_stack } = jojo.compose_jojo(world)
      const values = [...value_stack.stack].reverse()
      return "[" + values.map((value) => value.repr()).join(" ") + "]" + "\n"
    },
  }
}
