import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Evaluate from "../evaluate"
import * as Infer from "../infer"
import * as Readback from "../readback"

export function run(
  ctx: Ctx.Ctx,
  env: Env.Env,
  stmts: Array<Stmt.Stmt>
): string {
  let output = ""
  for (const stmt of stmts) {
    const new_ctx = Stmt.declare(ctx, stmt)
    if (new_ctx !== undefined) {
      ctx = new_ctx
    }
    const new_env = Stmt.execute(env, stmt)
    if (new_env !== undefined) {
      env = new_env
    }
    output += show(ctx, env, stmt)
  }

  return output
}

function show(ctx: Ctx.Ctx, env: Env.Env, stmt: Stmt.Stmt): string {
  if (stmt.kind === "Stmt.show") {
    const { exp } = stmt
    const t = Infer.infer(ctx, exp)
    const value = Evaluate.evaluate(env, exp)
    const value_repr = Readback.readback(ctx, t, value).repr()
    const t_repr = Readback.readback(ctx, Value.type, t).repr()
    return `${t_repr} -- ${value_repr}\n`
  }

  return ""
}
