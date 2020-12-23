import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"
import * as ut from "../../ut"
import { Fn } from "../exps"
import { VarNeutral } from "../exps/var-neutral"

export function readback(used: Set<string>, value: Value.Value): Exp.Exp {
  return value.readbackability({ used })
}
