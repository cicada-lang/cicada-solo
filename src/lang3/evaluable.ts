import { Mod } from "./mod"
import { Env } from "./env"
import { Value } from "./value"

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export type Evaluable = {
  _evaluable_signature: "_evaluable_signature"
  evaluate(the: { mod: Mod; env: Env; mode?: EvaluationMode }): Value
}

export function Evaluable(the: {
  evaluate(the: { mod: Mod; env: Env; mode?: EvaluationMode }): Value
}): Evaluable {
  return {
    _evaluable_signature: "_evaluable_signature",
    evaluate: the.evaluate,
  }
}
