import { Evaluable, EvaluationMode } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import { the_evaluable } from "./the-evaluable"

export type The = Evaluable &
  Repr & {
    kind: "Exp.the"
    t: Exp
    exp: Exp
  }

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    ...the_evaluable(t, exp),
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
  }
}
