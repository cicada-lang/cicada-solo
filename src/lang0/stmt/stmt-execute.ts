import * as Stmt from "../stmt"
import { Env } from "../env"
import * as Exp from "../exp"
import * as Evaluate from "../evaluate"

export function execute(env: Env, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      env.extend(stmt.name, Evaluate.evaluate(env, stmt.exp))
    }
  }
}
