import { Evaluable, EvaluationMode } from "../evaluable"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type Var = Evaluable & {
  kind: "Exp.v"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    evaluability(the) {
      const value = Env.lookup(the.env, name)
      if (value !== undefined) return value

      const mod_value = Mod.lookup_value(the.mod, name)
      if (mod_value === undefined)
        throw new Trace.Trace(Explain.explain_name_undefined(name))

      if (the.mode === EvaluationMode.mute_recursive_exp_in_mod) {
        // TODO We SHOULD NOT do this for non recursive `Den`.
        Mod.update(the.mod, name, Mod.lookup_den(the.mod, name)!, {
          cached_value: Value.not_yet(
            Mod.lookup_type(the.mod, name)!,
            Neutral.v(name)
          ),
        })
      }

      return mod_value
    },
  }
}
