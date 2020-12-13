import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as ut from "../../../ut"
import { begin_evaluable } from "./begin-evaluable"
import { begin_inferable } from "./begin-inferable"
import { begin_checkable } from "./begin-checkable"

export type Begin = Evaluable &
  Checkable &
  Inferable &
  Repr & AlphaRepr & {
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
    ...begin_inferable(stmts, ret),
    ...begin_checkable(stmts, ret),
    repr: () => {
      const s = [...stmts.map(Stmt.repr), ret.repr()].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
    alpha_repr: (opts) => {
      throw new Error("TODO")
    }
  }
}
