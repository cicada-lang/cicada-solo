import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"

export function readback(used: Set<string>, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return {
        kind: "Exp.v",
        name: neutral.name,
      }
    }
    case "Neutral.ap": {
      return {
        kind: "Exp.ap",
        target: readback(used, neutral.target),
        arg: Value.readback(used, neutral.arg),
      }
    }
  }
}
