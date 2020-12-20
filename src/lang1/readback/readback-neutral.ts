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
      return neutral.readback_neutral({ used })
    }
    case "Neutral.ap": {
      return neutral.readback_neutral({ used })
    }
    case "Neutral.rec": {
      return Rec(
        neutral.ret_t,
        Readback.readback_neutral(used, neutral.target),
        neutral.base.readback_normal({ used }),
        neutral.step.readback_normal({ used })
      )
    }
  }
}
