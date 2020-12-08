import { Evaluable, EvaluationMode } from "../evaluable"
import { Exp } from "../exp"
import { Repr } from "../repr"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type Typecons = Evaluable &
  Repr & {
    kind: "Exp.typecons"
    name: string
    t: Exp
    sums: Array<{ tag: string; t: Exp }>
  }

export function Typecons(
  name: string,
  t: Exp,
  sums: Array<{ tag: string; t: Exp }>
): Typecons {
  return {
    kind: "Exp.typecons",
    name,
    t,
    sums,
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.typecons(
        name,
        evaluator.evaluate(t, { mod, env, mode }),
        Value.DelayedSums.create(sums, mod, env)
      ),
    repr: () => name,
  }
}
