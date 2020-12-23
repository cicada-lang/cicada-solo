import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import { Var, Ap } from "../exps"

export function readback_neutral(
  used: Set<string>,
  neutral: Neutral.Neutral
): Exp.Exp {
  return neutral.readback_neutral({ used })
}
