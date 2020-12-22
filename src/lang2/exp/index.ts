export * from "./exp"
export * from "./exp-nat-ind-step-t"
export * from "./exp-equivalent"
export * from "./exp-nat-from-number"
export * from "./exp-nat-to-number"

import { Equal } from "../exps/equal"
import { Same } from "../exps/same"
import { Replace } from "../exps/replace"
import { Absurd } from "../exps/absurd"
import { AbsurdInd } from "../exps/absurd-ind"
import { Str } from "../exps/str"
import { Quote } from "../exps/quote"
import { Type } from "../exps/type"
import { Begin } from "../exps/begin"

export type equal = Equal
export const equal = Equal

export type same = Same
export const same = Same

export type replace = Replace
export const replace = Replace

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
