import * as Stmt from "../stmt"

export function repr(stmt: Stmt.Stmt): string {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      return `${name} = ${exp.repr()}`
    }
    case "Stmt.show": {
      const { exp } = stmt
      return `@show ${exp.repr()}`
    }
  }
}
