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

export type Str = Evaluable &
  Repr & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  evaluability: ({ mod, env, mode }) => Value.str,
  repr: () => "String",
}
