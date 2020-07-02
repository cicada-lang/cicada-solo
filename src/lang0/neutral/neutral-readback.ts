import * as Neutral from "../neutral"
import * as Value from "../value"
import * as Exp from "../exp"

export function readback(used: Set<string>, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.Var": {
      return {
        kind: "Exp.Var",
        name: neutral.name,
      }
    }
    case "Neutral.Ap": {
      return {
        kind: "Exp.Ap",
        target: readback(used, neutral.target),
        arg: Value.readback(used, neutral.arg),
      }
    }
  }
}
