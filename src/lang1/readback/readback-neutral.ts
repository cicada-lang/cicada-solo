import * as Readback from "../readback"
import * as Exp from "../exp"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

export function readback_neutral(
  used: Set<string>,
  neutral: Neutral.Neutral
): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Exp.v(neutral.name)
    }
    case "Neutral.ap": {
      return Exp.ap(
        Readback.readback_neutral(used, neutral.target),
        Readback.readback_normal(used, neutral.arg)
      )
    }
    case "Neutral.rec": {
      return Exp.rec(
        neutral.ret_t,
        Readback.readback_neutral(used, neutral.target),
        Readback.readback_normal(used, neutral.base),
        Readback.readback_normal(used, neutral.step)
      )
    }
  }
}
