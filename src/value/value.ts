import * as Closure from "./closure"
import * as Neutral from "../neutral"

import { TypeValue } from "../core/type-value"
import { AbsurdValue } from "../core/absurd-value"
import { PiValue } from "../core/pi-value"
import { TrivialValue } from "../core/trivial-value"
import { SoleValue } from "../core/sole-value"
import { EqualValue } from "../core/equal-value"
import { StrValue } from "../core/str-value"
import { NatValue } from "../core/nat-value"
import { SigmaValue } from "../core/sigma-value"
import { SameValue } from "../core/same-value"
import { ZeroValue } from "../core/zero-value"
import { Add1Value } from "../core/add1-value"
import { QuoteValue } from "../core/quote-value"
import { ConsValue } from "../core/cons-value"
import { FnValue } from "../core/fn-value"

export type Value =
  | pi
  | fn
  | sigma
  | cons
  | nat
  | zero
  | add1
  | equal
  | same
  | trivial
  | sole
  | absurd
  | str
  | quote
  | type
  | not_yet

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

export type nat = NatValue
export const nat: nat = new NatValue()

type zero = ZeroValue
export const zero: zero = new ZeroValue()

type add1 = Add1Value
export const add1 = (prev: Value): add1 => new Add1Value(prev)

export type equal = EqualValue
export const equal = (t: Value, from: Value, to: Value): equal =>
  new EqualValue(t, from, to)

type same = SameValue
export const same: same = new SameValue()

export type trivial = TrivialValue
export const trivial: trivial = new TrivialValue()

type sole = SoleValue
export const sole: sole = new SoleValue()

export type absurd = AbsurdValue
export const absurd: absurd = new AbsurdValue()

export type str = StrValue
export const str: str = new StrValue()

type quote = QuoteValue
export const quote = (str: string): quote => new QuoteValue(str)

export type type = TypeValue
export const type: type = new TypeValue()

type not_yet = {
  kind: "Value.not_yet"
  t: Value
  neutral: Neutral.Neutral
}

export const not_yet = (t: Value, neutral: Neutral.Neutral): not_yet => ({
  kind: "Value.not_yet",
  t,
  neutral,
})
