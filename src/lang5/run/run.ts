import { Stmt } from "../stmt"
import { World } from "../world"

export function run(stmts: Array<Stmt>, world: World): World {
  return stmts.reduce((prev, stmt) => stmt.execute(prev), world)
}
