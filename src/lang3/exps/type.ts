import { Evaluable, EvaluationMode } from "../evaluable"
import { Exp } from "../exp"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type Type = Evaluable & {
  kind: "Exp.type"
}

export const Type: Type = {
  kind: "Exp.type",
  evaluability: ({ mod, env, mode }) => Value.type,
}
