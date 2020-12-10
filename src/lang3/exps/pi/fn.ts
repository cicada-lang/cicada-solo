import { Var } from "../var"
import { evaluator } from "../../evaluator"
import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Check from "../../check"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Ctx from "../../ctx"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"
import { fn_evaluable } from "./fn-evaluable"
import { fn_checkable } from "./fn-checkable"

export type Fn = Evaluable &
  Checkable &
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
    ...fn_evaluable(pattern, ret),
    ...fn_checkable(pattern, ret),
    repr: () => `(${Pattern.repr(pattern)}) => ${ret.repr()}`,
  }
}
