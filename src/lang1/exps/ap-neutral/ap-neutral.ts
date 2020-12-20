import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Exp } from "../../exp"
import * as Readback from "../../readback"
import { Names } from "../../readbackable"
import { Ap } from "../ap"

export type ApNeutral = Neutral & {
  kind: "ApNeutral"
  target: Neutral
  arg: Normal
}

export function ApNeutral(target: Neutral, arg: Normal): ApNeutral {
  return {
    kind: "ApNeutral",
    target,
    arg,
    readback_neutral: ({ used }) =>
      Ap(target.readback_neutral({ used }), arg.readback_normal({ used })),
  }
}
