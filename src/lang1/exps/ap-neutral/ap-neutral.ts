import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Exp } from "../../exp"
import * as Readback from "../../readback"
import { Names } from "../../readbackable"
import { Ap } from "../ap"

export type ApNeutral = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal
  readback_neutral: (the: { used: Names }) => Exp
}

export function ApNeutral(target: Neutral, arg: Normal): ApNeutral {
  return {
    kind: "Neutral.ap",
    target,
    arg,
    readback_neutral: ({ used }) =>
      Ap(
        Readback.readback_neutral(used, target),
        arg.readback_normal({ used })
      ),
  }
}
