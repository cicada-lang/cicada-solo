import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Exp } from "../../exp"
import { Ty } from "../../ty"
import { Names } from "../../readbackable"
import { Rec } from "../rec"

export type RecNeutral = Neutral & {
  kind: "RecNeutral"
  ret_t: Ty
  target: Neutral
  base: Normal
  step: Normal
}

export function RecNeutral(
  ret_t: Ty,
  target: Neutral,
  base: Normal,
  step: Normal
): RecNeutral {
  return {
    kind: "RecNeutral",
    ret_t,
    target,
    base,
    step,
    readback_neutral: ({ used }) =>
      Rec(
        ret_t,
        target.readback_neutral({ used }),
        base.readback_normal({ used }),
        step.readback_normal({ used })
      ),
  }
}
