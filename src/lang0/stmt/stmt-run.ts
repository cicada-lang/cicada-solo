import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"

export function run(env: Env.Env, stmt: Stmt.Stmt): string {
  Stmt.execute(env, stmt)

  if (stmt.kind === "Stmt.show") {
    const { exp } = stmt
    const value = Exp.evaluate(env, exp)
    const norm = Value.readback(new Set(env.keys()), value)
    return Exp.repr(norm)
  }

  return ""
}
