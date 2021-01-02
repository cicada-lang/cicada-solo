import { Decl } from "../decl"
import { World } from "../world"

export function run(decls: Array<Decl>, world: World): string {
  const final = decls.reduce((prev, decl) => decl.assemble(prev), world)
  decls.map((decl) => decl.check(final))
  return decls.map((decl) => (decl.output ? decl.output(final) : "")).join("")
}
