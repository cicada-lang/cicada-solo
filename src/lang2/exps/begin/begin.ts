import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

import * as ut from "../../../ut"

export type Begin = Evaluable &
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
    evaluability: ({ env }) => {
      const new_env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(new_env, stmt)
      }
      return evaluate(new_env, ret)
    },
    repr: () => {
      const s = [...stmts.map(Stmt.repr), ret.repr()].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
    alpha_repr: (opts) => {
      throw new Error()
      // const parts = []
      // let new_opts = opts
      // for (const stmt of stmts) {
      //   const [stmt_repr, next] = alpha_repr_stmt(stmt, new_opts)
      //   new_opts = next
      //   parts.push(stmt_repr)
      // }
      // parts.push(ret.repr())
      // const s = parts.join("\n")
      // return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
