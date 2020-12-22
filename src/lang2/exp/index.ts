export * from "./exp"
export * from "./exp-nat-ind-step-t"
export * from "./exp-equivalent"
export * from "./exp-nat-from-number"
export * from "./exp-nat-to-number"

import { Cons } from "../exps/cons"
import { Car } from "../exps/car"
import { Cdr } from "../exps/cdr"
import { Nat } from "../exps/nat"
import { Zero } from "../exps/zero"
import { Add1 } from "../exps/add1"
import { NatInd } from "../exps/nat-ind"
import { Equal } from "../exps/equal"
import { Same } from "../exps/same"
import { Replace } from "../exps/replace"
import { Trivial } from "../exps/trivial"
import { Sole } from "../exps/sole"
import { Absurd } from "../exps/absurd"
import { AbsurdInd } from "../exps/absurd-ind"
import { Str } from "../exps/str"
import { Quote } from "../exps/quote"
import { Type } from "../exps/type"
import { Begin } from "../exps/begin"

export type cons = Cons
export const cons = Cons

export type car = Car
export const car = Car

export type cdr = Cdr
export const cdr = Cdr

export type nat = Nat
export const nat = Nat

export type zero = Zero
export const zero = Zero

export type add1 = Add1
export const add1 = Add1

export type nat_ind = NatInd
export const nat_ind = NatInd

export type equal = Equal
export const equal = Equal

export type same = Same
export const same = Same

export type replace = Replace
export const replace = Replace

export type trivial = Trivial
export const trivial = Trivial

export type sole = Sole
export const sole = Sole

export type absurd = Absurd
export const absurd = Absurd

export type absurd_ind = AbsurdInd
export const absurd_ind = AbsurdInd

export type str = Str
export const str = Str

export type quote = Quote
export const quote = Quote

export type type = Type
export const type = Type

export type begin = Begin
export const begin = Begin
