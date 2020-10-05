import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Exp from "../exp"

export function execute(env: Env.Env, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      Env.update(env, name, Exp.evaluate(env, exp))
    }
  }
}

// const exp = frontend.parse_exp(text)
// const ctx = Ctx.init()
// const t = Exp.infer(ctx, exp)
// const value = Exp.evaluate(Ctx.to_env(ctx), exp)
// const value_repr = Exp.repr(Value.readback(ctx, t, value))
// const t_repr = Exp.repr(Value.readback(ctx, Value.type, t))
// console.log(`${value_repr}: ${t_repr}`)
