import { Evaluable } from "../../evaluable"
import * as Env from "../../env"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"

export const var_evaluable = (name: string) =>
  Evaluable({
    evaluability: ({ env }) => {
      const result = Env.lookup(env, name)
      if (result === undefined) {
        throw new Trace.Trace(Explain.explain_name_undefined(name))
      }
      return result
    },
  })
