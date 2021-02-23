import * as Stmt from "../stmt"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import { World } from "../world"

export function run_stmts(
  ctx: Ctx.Ctx,
  env: Env.Env,
  stmts: Array<Stmt.Stmt>
): string {
  let world = new World({ ctx, env })
  for (const stmt of stmts) {
    world = stmt.execute(world)
  }

  return world.output
}
