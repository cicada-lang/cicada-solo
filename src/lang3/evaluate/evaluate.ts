import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Pattern from "../pattern"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type EvaluationOpts = {
  mode?: EvaluationMode
}

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp,
  opts: EvaluationOpts = {}
): Value.Value {
  try {
    return exp.evaluability({ mod, env, mode: opts.mode })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }

    throw error
  }
}
