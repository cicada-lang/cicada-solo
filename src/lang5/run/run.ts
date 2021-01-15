import { Stmt } from "../stmt"
import { World } from "../world"

export function run(stmts: Array<Stmt>, world: World): string {
  const final = stmts.reduce((prev, stmt) => stmt.execute(prev), world)
  return stmts.map((stmt) => (stmt.output ? stmt.output(final) : "")).join("")
}
