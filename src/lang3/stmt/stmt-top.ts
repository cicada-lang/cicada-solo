import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function top(mod: Mod.Mod, ctx: Ctx.Ctx, env: Env.Env, stmt: Stmt.Stmt): void {
  Stmt.declare(mod, ctx, stmt)
  Stmt.execute(mod, env, stmt)

  switch (stmt.kind) {
    case "Stmt.show": {
      const { exp } = stmt
      const t = Exp.infer(mod, ctx, exp)
      const value = Exp.evaluate(mod, env, exp)
      const value_repr = Exp.repr(Value.readback(ctx, t, value))
      const t_repr = Exp.repr(Value.readback(ctx, Value.type, t))
      console.log(`${t_repr} -- ${value_repr}`)
    }
  }
}
