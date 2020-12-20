import * as Readback from "../readback"
import { Exp } from "../exp"
import { Var, Rec, Ap } from "../exps"
import * as Neutral from "../neutral"

export function readback_neutral(
  used: Set<string>,
  neutral: Neutral.Neutral
): Exp {
  return neutral.readback_neutral({ used })
}
