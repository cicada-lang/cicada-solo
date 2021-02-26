import { Ctx } from "../ctx"
import { Exp } from "../exp"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

import * as Neutral from "../neutral"

import { NotYetValue } from "../core/not-yet-value"

type not_yet = NotYetValue
export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet =>
  new NotYetValue(t, neutral)
