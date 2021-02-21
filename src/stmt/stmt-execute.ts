import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Evaluate from "../evaluate"

export function execute(env: Env.Env, stmt: Stmt.Stmt): Env.Env | undefined {
  switch (stmt.kind) {
    case "Stmt.def": {
      return Env.extend(env, stmt.name, Evaluate.evaluate(env, stmt.exp))
    }
  }
}
