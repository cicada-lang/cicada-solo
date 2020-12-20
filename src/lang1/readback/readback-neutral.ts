import * as Readback from "../readback"
import { Exp } from "../exp"
import { Var, Rec, Ap } from "../exps"
import * as Neutral from "../neutral"

export function readback_neutral(
  used: Set<string>,
  neutral: Neutral.Neutral
): Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Var(neutral.name)
    }
    case "Neutral.ap": {
      return Ap(
        Readback.readback_neutral(used, neutral.target),
        Readback.readback_normal(used, neutral.arg)
      )
    }
    case "Neutral.rec": {
      return Rec(
        neutral.ret_t,
        Readback.readback_neutral(used, neutral.target),
        Readback.readback_normal(used, neutral.base),
        Readback.readback_normal(used, neutral.step)
      )
    }
  }
}
