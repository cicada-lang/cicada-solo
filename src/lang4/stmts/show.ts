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
    check: (world) => jojo.jos_cut(world),
    output: (world) => {
      const { value_stack } = jojo.jos_compose(world)
      const values = [...value_stack.values].reverse()
      return "[ " + values.map((value) => value.repr()).join(" ") + " ]" + "\n"
    },
  }
}
