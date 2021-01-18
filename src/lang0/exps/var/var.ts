import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Env from "../../env"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"

export type Var = Exp & {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
    ...Evaluable({
      evaluability: ({ env }) => {
        const result = env.lookup(name)
        if (result === undefined) {
          throw new Trace.Trace(Explain.explain_name_undefined(name))
        }
        return result
      },
    }),
    repr: () => name,
  }
}
