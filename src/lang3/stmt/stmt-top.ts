import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"

export function top(ctx: Ctx.Ctx, env: Env.Env, stmt: Stmt.Stmt): void {
  Stmt.declare(ctx, stmt)
  Stmt.execute(env, stmt)

  switch (stmt.kind) {
    case "Stmt.show": {
      const { exp } = stmt
      const t = Exp.infer(ctx, exp)
      const value = Exp.evaluate(env, exp)
      const value_repr = Exp.repr(Value.readback(ctx, t, value))
      const t_repr = Exp.repr(Value.readback(ctx, Value.type, t))
      console.log(`${value_repr}: ${t_repr}`)
    }
  }
}
