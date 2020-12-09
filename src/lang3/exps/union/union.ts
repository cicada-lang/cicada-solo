import { Evaluable, EvaluationMode } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import { union_evaluable } from "./union-evaluable"

export type Union = Evaluable &
  Repr & {
    kind: "Exp.union"
    left: Exp
    right: Exp
  }

export function Union(left: Exp, right: Exp): Union {
  return {
    kind: "Exp.union",
    left,
    right,
    ...union_evaluable(left, right),
    repr: () => `{ ${left.repr()} | ${right.repr()} }`,
  }
}
