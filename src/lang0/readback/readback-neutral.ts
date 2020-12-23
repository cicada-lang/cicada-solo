import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import { Var, Ap } from "../exps"

export function readback_neutral(
  used: Set<string>,
  neutral: Neutral.Neutral
): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return neutral.readback_neutral({ used })
    }
    case "Neutral.ap": {
      return neutral.readback_neutral({ used })
    }
  }
}
