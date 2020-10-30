import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Evaluator from "../evaluator"

export function execute(env: Env.Env, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      Env.update(env, stmt.name, Evaluator.evaluate(Evaluator.create(env), stmt.exp))
    }
  }
}
