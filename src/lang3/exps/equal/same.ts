import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Readback from "../../readback"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"
import { same_evaluable } from "./same-evaluable"
import { same_checkable } from "./same-checkable"

export type Same = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.same"
  }

export const Same: Same = {
  kind: "Exp.same",
  ...same_evaluable,
  ...same_checkable,
  repr: () => "same",
}
