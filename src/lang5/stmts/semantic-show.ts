import { Stmt } from "../stmt"
import { World } from "../world"
import { JoJo } from "../jos/jojo"
import * as ut from "../../ut"

export type SemanticShow = Stmt & {
  jojo: JoJo
}

export function SemanticShow(jojo: JoJo): SemanticShow {
  return {
    jojo,
    execute: (world) => {
      const final = jojo.jos_execute(world)
      return world.output_append(
        final.value_stack.semantic_repr() +
          final.application_trace
            .map((value_stack) => "- " + value_stack.semantic_repr())
            .join("") +
          "\n"
      )
    },
  }
}
