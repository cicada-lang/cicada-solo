import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export type Obj = Evaluable & {
  kind: "Exp.obj"
  properties: Map<string, Exp>
}

export function Obj(properties: Map<string, Exp>): Obj {
  return {
    kind: "Exp.obj",
    properties,
    evaluability(the) {
      return Value.obj(
        new Map(
          Array.from(properties, ([name, exp]) => [
            name,
            Evaluate.evaluate(the.mod, the.env, exp, { mode: the.mode }),
          ])
        )
      )
    },
  }
}
