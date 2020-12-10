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
import { replace_evaluable } from "./replace-evaluable"

export type Replace = Evaluable &
  Repr & {
    kind: "Exp.replace"
    target: Exp
    motive: Exp
    base: Exp
  }

export function Replace(target: Exp, motive: Exp, base: Exp): Replace {
  return {
    kind: "Exp.replace",
    target,
    motive,
    base,
    ...replace_evaluable(target, motive, base),
    repr: () => `replace(${target.repr()}, ${motive.repr()}, ${base.repr()})`,
  }
}
