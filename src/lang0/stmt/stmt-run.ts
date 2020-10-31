import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Evaluate from "../evaluate"
import * as Readback from "../readback"

export function run(env: Env.Env, stmts: Array<Stmt.Stmt>): string {
  let output = ""
  for (const stmt of stmts) {
    Stmt.execute(env, stmt)
    output += show(env, stmt)
  }

  return output
}

function show(env: Env.Env, stmt: Stmt.Stmt): string {
  if (stmt.kind === "Stmt.show") {
    const { exp } = stmt
    const value = Evaluate.evaluate(env, exp)
    const norm = Readback.readback(new Set(env.keys()), value)
    const norm_repr = Exp.repr(norm)
    return `${norm_repr}\n`
  }

  return ""
}
