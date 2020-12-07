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

export type Fn = Evaluable & {
  kind: "Exp.fn"
  pattern: Pattern.Pattern
  ret: Exp
}

export function Fn(pattern: Pattern.Pattern, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    pattern,
    ret,
    evaluability(the) {
      return Value.fn(Value.Closure.create(the.mod, the.env, pattern, ret))
    },
  }
}
