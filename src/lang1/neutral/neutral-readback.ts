import * as Exp from "../exp"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

export function readback(used: Set<string>, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Exp.v(neutral.name)
    }
    case "Neutral.ap": {
      return Exp.ap(
        Neutral.readback(used, neutral.target),
        Normal.readback(used, neutral.arg)
      )
    }
    case "Neutral.rec": {
      return Exp.rec(
        neutral.ret_t,
        Neutral.readback(used, neutral.target),
        Normal.readback(used, neutral.base),
        Normal.readback(used, neutral.step)
      )
    }
  }
}
