import { Ctx } from "../ctx"
import { Exp } from "../exp"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

import * as Closure from "./closure"
import * as Neutral from "../neutral"

import { SigmaValue } from "../core/sigma-value"
import { ConsValue } from "../core/cons-value"
import { FnValue } from "../core/fn-value"
import { NotYetValue } from "../core/not-yet-value"

type fn = FnValue
export const fn = (ret_cl: Closure.Closure): fn => new FnValue(ret_cl)

export type sigma = SigmaValue
export const sigma = (car_t: Value, cdr_t_cl: Closure.Closure): sigma =>
  new SigmaValue(car_t, cdr_t_cl)

type cons = ConsValue
export const cons = (car: Value, cdr: Value): cons => new ConsValue(car, cdr)

type not_yet = NotYetValue
export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet =>
  new NotYetValue(t, neutral)
