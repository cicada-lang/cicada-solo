import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

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
        target: Neutral.readback(used, neutral.target),
        arg: Normal.readback(used, neutral.arg),
      }
    }
    case "Neutral.Rec": {
      return {
        kind: "Exp.Rec",
        t: neutral.ret_t,
        target: Neutral.readback(used, neutral.target),
        base: Normal.readback(used, neutral.base),
        step: Normal.readback(used, neutral.step),
      }
    }
  }
}
