import { Ctx } from "../ctx"
import { Exp } from "../exp"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}

import * as Closure from "./closure"
import * as Neutral from "../neutral"

import { PiValue } from "../core/pi-value"
import { EqualValue } from "../core/equal-value"
import { SigmaValue } from "../core/sigma-value"
import { SameValue } from "../core/same-value"
import { ZeroValue } from "../core/zero-value"
import { Add1Value } from "../core/add1-value"
import { ConsValue } from "../core/cons-value"
import { FnValue } from "../core/fn-value"
import { NotYetValue } from "../core/not-yet-value"

export type pi = PiValue
export const pi = (arg_t: Value, ret_t_cl: Closure.Closure): pi =>
  new PiValue(arg_t, ret_t_cl)

type fn = FnValue
export const fn = (ret_cl: Closure.Closure): fn => new FnValue(ret_cl)

export type sigma = SigmaValue
export const sigma = (car_t: Value, cdr_t_cl: Closure.Closure): sigma =>
  new SigmaValue(car_t, cdr_t_cl)

type cons = ConsValue
export const cons = (car: Value, cdr: Value): cons => new ConsValue(car, cdr)

type zero = ZeroValue
export const zero: zero = new ZeroValue()

type add1 = Add1Value
export const add1 = (prev: Value): add1 => new Add1Value(prev)

export type equal = EqualValue
export const equal = (t: Value, from: Value, to: Value): equal =>
  new EqualValue(t, from, to)

type same = SameValue
export const same: same = new SameValue()

type not_yet = NotYetValue
export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet =>
  new NotYetValue(t, neutral)
