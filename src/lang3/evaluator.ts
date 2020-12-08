import { Evaluable, EvaluationMode } from "./evaluable" 
import { Value } from "./value"
import { Mod } from "./mod"
import { Env } from "./env"
import * as Trace from "../trace"

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

export const evaluator: Evaluator = {
  evaluate(evaluable, { mod, env, mode }): Value {
    try {
      return evaluable.evaluability({ mod, env, mode, evaluator })
    } catch (error) {
      if (error instanceof Trace.Trace) {
        throw Trace.trail(error, evaluable)
      }
      throw error
    }
  },
}
