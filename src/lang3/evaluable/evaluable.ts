import { Mod } from "../mod"
import { Env } from "../env"
import { Value } from "../value"
import { Evaluator } from "../evaluator"

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export type Evaluable = {
  evaluability(the: {
    mod: Mod
    env: Env
    mode?: EvaluationMode
    evaluator: Evaluator
  }): Value
}

export function Evaluable(the: Evaluable): Evaluable {
  return the
}
