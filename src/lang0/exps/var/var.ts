import { Evaluable } from "../../evaluable"
import * as Env from "../../env"
import * as Value from "../../value"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"

export type Var = Evaluable & {
  kind: "Exp.v"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    ...Evaluable({
      evaluability: ({ env }) => {
        const result = Env.lookup(env, name)
        if (result === undefined) {
          throw new Trace.Trace(Explain.explain_name_undefined(name))
        }
        return result
      },
    }),
  }
}
