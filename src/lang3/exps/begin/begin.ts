import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as ut from "../../../ut"
import { begin_evaluable } from "./begin-evaluable"
import { begin_checkable } from "./begin-checkable"

export type Begin = Evaluable &
  Checkable &
  Repr & {
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
    ...begin_checkable(stmts, ret),
    repr: () => {
      const s = [...stmts.map(Stmt.repr), ret.repr()].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
