export * from "./exp"
export * from "./exp-equivalent"

// TODO This module should not be a dependency hub.

import { Var } from "../exps/var"
import { Pi } from "../exps/pi"
import { Fn } from "../exps/fn"
import { CaseFn } from "../exps/case-fn"
import { Ap } from "../exps/ap"
import { Cls } from "../exps/cls"
import { Obj } from "../exps/obj"
import { Dot } from "../exps/dot"
import { Equal } from "../exps/equal"
import { Same } from "../exps/same"
import { Replace } from "../exps/replace"
import { Absurd } from "../exps/absurd"
import { AbsurdInd } from "../exps/absurd-ind"
import { Str } from "../exps/str"
import { Quote } from "../exps/quote"
import { Union } from "../exps/union"
import { Typecons } from "../exps/typecons"
import { Type } from "../exps/type"
import { Begin } from "../exps/begin"
import { The } from "../exps/the"

export type v = Var
export const v = Var

export type pi = Pi
export const pi = Pi

export type fn = Fn
export const fn = Fn

export type case_fn = CaseFn
export const case_fn = CaseFn

export type ap = Ap
export const ap = Ap

export type cls = Cls
export const cls = Cls

export type obj = Obj
export const obj = Obj

export type dot = Dot
export const dot = Dot

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

export type union = Union
export const union = Union

export type typecons = Typecons
export const typecons = Typecons

export type type = Type
export const type = Type

export type begin = Begin
export const begin = Begin

export type the = The
export const the = The
