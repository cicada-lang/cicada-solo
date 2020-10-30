import * as Evaluator from "../evaluator"
import * as Env from "../env"

export function create(env: Env.Env): Evaluator.Evaluator {
  return { env }
}
