import * as Exp from "../exp"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

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
        target: Neutral.readback(used, neutral.target),
        arg: Normal.readback(used, neutral.arg),
      }
    }
    case "Neutral.rec": {
      return {
        kind: "Exp.rec",
        t: neutral.ret_t,
        target: Neutral.readback(used, neutral.target),
        base: Normal.readback(used, neutral.base),
        step: Normal.readback(used, neutral.step),
      }
    }
  }
}
