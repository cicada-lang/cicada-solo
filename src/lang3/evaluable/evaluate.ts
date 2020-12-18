import { Evaluable, EvaluationMode } from "../evaluable"
import { Value } from "../value"
import { Mod } from "../mod"
import { Env } from "../env"
import * as Trace from "../../trace"

export type Evaluator = {
  evaluate(
    evaluable: Evaluable,
    the: {
      mod: Mod
      env: Env
      mode?: EvaluationMode
    }
  ): Value
}

export function evaluate(
  evaluable: Evaluable,
  the: {
    mod: Mod
    env: Env
    mode?: EvaluationMode
  }
): Value {
  const { mod, env, mode } = the
  try {
    return evaluable.evaluability({ mod, env, mode })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, evaluable)
    }
    throw error
  }
}
