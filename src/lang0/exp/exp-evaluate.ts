import * as Evaluator from "../evaluator"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Value from "../value"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  return Evaluator.evaluate(Evaluator.create(env), exp)
}
