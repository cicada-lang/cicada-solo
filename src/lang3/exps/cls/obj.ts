import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export type Obj = Evaluable &
  Repr & {
    kind: "Exp.obj"
    properties: Map<string, Exp>
  }

export function Obj(properties: Map<string, Exp>): Obj {
  return {
    kind: "Exp.obj",
    properties,
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.obj(
        new Map(
          Array.from(properties, ([name, exp]) => [
            name,
            evaluator.evaluate(exp, { mod, env, mode }),
          ])
        )
      ),
    repr: () => {
      const s = Array.from(properties)
        .map(([name, exp]) => `${name} = ${exp.repr()}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
