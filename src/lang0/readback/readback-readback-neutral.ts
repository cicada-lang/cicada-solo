import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Exp from "../exp"

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
        Readback.readback(used, neutral.arg)
      )
    }
  }
}
