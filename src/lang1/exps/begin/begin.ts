import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import { begin_evaluable } from "./begin-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"
import * as ut from "../../../ut"

export type Begin = Evaluable & Repr & {
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
    repr: () => {
      const s = [...stmts.map(Stmt.repr), repr(ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    }
  }
}
