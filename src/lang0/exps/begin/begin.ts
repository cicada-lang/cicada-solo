import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Env from "../../env"
import * as ut from "../../../ut"

export type Begin = Exp & {
  kind: "Begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export function Begin(stmts: Array<Stmt.Stmt>, ret: Exp): Begin {
  return {
    kind: "Begin",
    stmts,
    ret,
    ...Evaluable({
      evaluability: ({ env }) => {
        const new_env = Env.clone(env)
        for (const stmt of stmts) {
          Stmt.execute(new_env, stmt)
        }
        return evaluate(new_env, ret)
      },
    }),
    repr: () => {
      const s = [...stmts.map(Stmt.repr), ret.repr()].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
