import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import { begin_evaluable } from "./begin-evaluable"

export type Begin = Evaluable & {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export function Begin(stmts: Array<Stmt.Stmt>, ret: Exp): Begin {
  return {
    kind: "Exp.begin",
    stmts,
    ret,
    ...begin_evaluable(stmts, ret),
  }
}
