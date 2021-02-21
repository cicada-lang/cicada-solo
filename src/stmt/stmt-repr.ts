import * as Stmt from "../stmt"
import * as Exp from "../exp"

export function repr(stmt: Stmt.Stmt): string {
  switch (stmt.kind) {
    case "Stmt.def": {
      return `${stmt.name} = ${stmt.exp.repr()}`
    }
    case "Stmt.show": {
      return `@show ${stmt.exp.repr()}`
    }
  }
}
