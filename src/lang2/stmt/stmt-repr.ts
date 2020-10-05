import * as Stmt from "../stmt"
import * as Exp from "../exp"

export function repr(stmt: Stmt.Stmt): string {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      return `${name} = ${Exp.repr(exp)}`
    }
  }
}
