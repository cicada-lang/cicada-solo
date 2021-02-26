import { Ctx } from "../ctx"
import { Exp } from "../exp"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

import * as Neutral from "../neutral"

import { ConsValue } from "../core/cons-value"
import { NotYetValue } from "../core/not-yet-value"

type cons = ConsValue
export const cons = (car: Value, cdr: Value): cons => new ConsValue(car, cdr)

type not_yet = NotYetValue
export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet =>
  new NotYetValue(t, neutral)
