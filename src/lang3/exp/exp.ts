import { Var } from "../exps/var"
import { Pi } from "../exps/pi/pi"
import { Fn } from "../exps/pi/fn"
import { CaseFn } from "../exps/pi/case-fn"
import { Ap } from "../exps/pi/ap"
import { Cls } from "../exps/cls/cls"
import { Obj } from "../exps/cls/obj"
import { Dot } from "../exps/cls/dot"
import { Equal } from "../exps/equal/equal"
import { Same } from "../exps/equal/same"
import { Replace } from "../exps/equal/replace"
import { Absurd } from "../exps/absurd/absurd"
import { AbsurdInd } from "../exps/absurd/absurd-ind"
import { Str } from "../exps/str/str"
import { Quote } from "../exps/str/quote"
import { Union } from "../exps/union"
import { Typecons } from "../exps/typecons"
import { Type } from "../exps/type"
import { Begin } from "../exps/begin"
import { The } from "../exps/the"

import { Evaluable } from "../evaluable"
import { Checkable } from "../checkable"
import { Inferable } from "../inferable"
import { Repr } from "../repr"

// TODO change sum type into intersection type

// export type Exp = Repr &
//   Evaluable &
//   Checkable &
//   Inferable & {
//     kind:
//       | "Exp.v"
//       | "Exp.pi"
//       | "Exp.fn"
//       | "Exp.case_fn"
//       | "Exp.ap"
//       | "Exp.cls"
//       | "Exp.obj"
//       | "Exp.dot"
//       | "Exp.equal"
//       | "Exp.same"
//       | "Exp.replace"
//       | "Exp.absurd"
//       | "Exp.absurd_ind"
//       | "Exp.str"
//       | "Exp.quote"
//       | "Exp.union"
//       | "Exp.typecons"
//       | "Exp.type"
//       | "Exp.begin"
//       | "Exp.the"
//   }

export type Exp =
  | Var
  | Pi
  | Fn
  | CaseFn
  | Ap
  | Cls
  | Obj
  | Dot
  | Equal
  | Same
  | Replace
  | Absurd
  | AbsurdInd
  | Str
  | Quote
  | Union
  | Typecons
  | Type
  | Begin
  | The

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
