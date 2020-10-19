import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"

export function run(
  ctx: Ctx.Ctx,
  env: Env.Env,
  stmt: Stmt.Stmt
): undefined | string {
  Stmt.declare(ctx, stmt)
  Stmt.execute(env, stmt)

  if (stmt.kind === "Stmt.show") {
    const { exp } = stmt
    const t = Exp.infer(ctx, exp)
    const value = Exp.evaluate(env, exp)
    const value_repr = Exp.repr(Value.readback(ctx, t, value))
    const t_repr = Exp.repr(Value.readback(ctx, Value.type, t))
    return `${t_repr} -- ${value_repr}`
  }
}
