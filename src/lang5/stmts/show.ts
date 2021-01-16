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
    execute: (world) => {
      const final = jojo.jos_execute(world)
      const value_stack_repr = final.value_stack.repr()
      const application_trace_repr = final.application_trace
        .map(({ mark, value_stack }) => "- " + `#${mark} @ ` + value_stack.repr())
        .join("")
      return world.output_append(value_stack_repr + application_trace_repr)
    },
  }
}
