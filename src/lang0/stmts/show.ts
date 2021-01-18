import { Stmt } from "../stmt"
import { Exp } from "../exp"
import { evaluate } from "../evaluate"
import { readback } from "../readback"

export type Show = Stmt & {
  kind: "Show"
  exp: Exp
}

export function Show(exp: Exp): Show {
  return {
    kind: "Show",
    exp,
    execute(world) {
      const value = evaluate(world.env, exp)
      const norm = readback(new Set(world.env.names), value)
      return world.output_append(norm.repr() + "\n")
    },
  }
}
