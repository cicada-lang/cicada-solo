import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"

export function readback(used: Set<string>, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Exp.v(neutral.name)
    }
    case "Neutral.ap": {
      return Exp.ap(
        readback(used, neutral.target),
        Value.readback(used, neutral.arg)
      )
    }
  }
}
