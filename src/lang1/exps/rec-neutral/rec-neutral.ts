import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Exp } from "../../exp"
import { Ty } from "../../ty"
import * as Readback from "../../readback"
import { Names } from "../../readbackable"
import { Rec } from "../rec"

export type RecNeutral = {
  kind: "Neutral.rec"
  ret_t: Ty
  target: Neutral
  base: Normal
  step: Normal
  readback_neutral: (the: { used: Names }) => Exp
}

export function RecNeutral(
  ret_t: Ty,
  target: Neutral,
  base: Normal,
  step: Normal
): RecNeutral {
  return {
    kind: "Neutral.rec",
    ret_t,
    target,
    base,
    step,
    readback_neutral: ({ used }) =>
      Rec(
        ret_t,
        Readback.readback_neutral(used, target),
        base.readback_normal({ used }),
        step.readback_normal({ used })
      ),
  }
}
