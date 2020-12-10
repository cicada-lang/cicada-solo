import { Evaluable, EvaluationMode } from "../../evaluable"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export const var_evaluable = (name: string) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) => {
      const value = Env.lookup(env, name)
      if (value !== undefined) return value
      const mod_value = Mod.lookup_value(mod, name)
      if (mod_value === undefined)
        throw new Trace.Trace(Explain.explain_name_undefined(name))
      if (mode === EvaluationMode.mute_recursive_exp_in_mod) {
        // TODO We SHOULD NOT do this for non recursive `Den`.
        Mod.update(mod, name, Mod.lookup_den(mod, name)!, {
          cached_value: Value.not_yet(
            Mod.lookup_type(mod, name)!,
            Neutral.v(name)
          ),
        })
      }
      return mod_value
    },
  })
