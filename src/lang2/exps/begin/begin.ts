import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Ctx from "../../ctx"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { infer } from "../../infer"
import { Repr } from "../../repr"
import { AlphaRepr, AlphaReprOpts } from "../../alpha-repr"
import * as ut from "../../../ut"
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
    evaluability: ({ env }) => {
      const new_env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(new_env, stmt)
      }
      return evaluate(new_env, ret)
    },
    ...Inferable({
      inferability: ({ ctx }) => {
        const new_ctx = Ctx.clone(ctx)
        for (const stmt of stmts) {
          Stmt.declare(new_ctx, stmt)
        }
        return infer(new_ctx, ret)
      },
    }),
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
    case "Stmt.show": {
      return ["", opts]
    }
  }
}
