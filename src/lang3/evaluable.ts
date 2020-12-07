import { Mod } from "./mod"
import { Env } from "./env"
import { Value } from "./value"

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export type Evaluable = {
  evaluability(the: { mod: Mod; env: Env; mode?: EvaluationMode }): Value
}

export function Evaluable(the: {
  evaluability(the: { mod: Mod; env: Env; mode?: EvaluationMode }): Value
}): Evaluable {
  return {
    evaluability: the.evaluability,
  }
}
