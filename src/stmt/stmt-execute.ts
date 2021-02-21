import * as Stmt from "../stmt"
import { Env } from "../env"
import * as Exp from "../exp"
import { evaluate } from "../evaluate"

export function execute(env: Env, stmt: Stmt.Stmt): Env | undefined {
  switch (stmt.kind) {
    case "Stmt.def": {
      return env.extend(stmt.name, evaluate(env, stmt.exp))
    }
  }
}
