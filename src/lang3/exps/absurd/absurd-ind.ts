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
import { absurd_ind_evaluable } from "./absurd-ind-evaluable"

export type AbsurdInd = Evaluable &
  Repr & {
    kind: "Exp.absurd_ind"
    target: Exp
    motive: Exp
  }

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "Exp.absurd_ind",
    target,
    motive,
    ...absurd_ind_evaluable(target, motive),
    repr: () => `Absurd.ind(${target.repr()}, ${motive.repr()})`,
  }
}
