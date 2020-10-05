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
