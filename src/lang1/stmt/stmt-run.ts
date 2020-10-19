import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"

export function run(ctx: Ctx.Ctx, env: Env.Env, stmt: Stmt.Stmt): string {
  Stmt.declare(ctx, stmt)
  Stmt.execute(env, stmt)

  if (stmt.kind === "Stmt.show") {
    const { exp } = stmt
    const t = Exp.infer(ctx, exp)
    const value = Exp.evaluate(env, exp)
    const norm = Value.readback(new Set(ctx.keys()), t, value)
    const value_repr = Exp.repr(norm)
    const t_repr = Ty.repr(t)
    return `${t_repr} -- ${value_repr}`
  }

  return ""
}
