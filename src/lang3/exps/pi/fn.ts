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

export type Fn = Evaluable &
  Repr & {
    kind: "Exp.fn"
    pattern: Pattern.Pattern
    ret: Exp
  }

export function Fn(pattern: Pattern.Pattern, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    pattern,
    ret,
    evaluability: ({ mod, env, mode }) =>
      Value.fn(Value.Closure.create(mod, env, pattern, ret)),
    repr: () => `(${Pattern.repr(pattern)}) => ${ret.repr()}`,
  }
}
