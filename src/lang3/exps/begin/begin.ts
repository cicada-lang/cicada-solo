import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr, AlphaReprOpts } from "../../alpha-repr"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as ut from "../../../ut"
import { begin_evaluable } from "./begin-evaluable"
import { begin_inferable } from "./begin-inferable"
import { begin_checkable } from "./begin-checkable"

export type Begin = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
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
      const parts = []
      let new_opts = opts
      for (const stmt of stmts) {
        const [stmt_repr, next] = alpha_repr_stmt(stmt, new_opts)
        new_opts = next
        parts.push(stmt_repr)
      }
      parts.push(ret.repr())
      const s = parts.join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}

function alpha_repr_stmt(
  stmt: Stmt.Stmt,
  opts: AlphaReprOpts
): [string, AlphaReprOpts] {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      return [
        `${name} = ${exp.alpha_repr(opts)}`,
        {
          depth: opts.depth + 1,
          depths: new Map([...opts.depths, [name, opts.depth]]),
        },
      ]
    }
  }
}
