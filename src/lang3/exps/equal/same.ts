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

export type Same = Evaluable & Repr & {
  kind: "Exp.same"
}

export const Same: Same = {
  kind: "Exp.same",
  evaluability: ({ mod, env, mode }) => Value.same,
  repr: () => "same",
}
