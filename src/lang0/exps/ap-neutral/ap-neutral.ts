import { Value } from "../../value"
import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Names } from "../../readbackable"
import { readback } from "../../readback"
import { Ap } from "../ap"

export type ApNeutral = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Value
  readback_neutral: (the: { used: Names }) => Exp
}

export function ApNeutral(target: Neutral, arg: Value): ApNeutral {
  return {
    kind: "Neutral.ap",
    target,
    arg,
    readback_neutral: ({ used }) =>
      Ap(target.readback_neutral({ used }), readback(used, arg)),
  }
}
