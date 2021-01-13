import { Stmt } from "../stmt"
import { World } from "../world"

export function run(stmts: Array<Stmt>, world: World): string {
  const final = stmts.reduce((prev, stmt) => stmt.assemble(prev), world)
  stmts.map((stmt) => stmt.check(final))
  return stmts.map((stmt) => (stmt.output ? stmt.output(final) : "")).join("")
}
