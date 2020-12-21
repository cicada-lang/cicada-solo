import { Var } from "../exps/var"
import { Pi } from "../exps/pi"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"
import { Sigma } from "../exps/sigma"
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

export type Exp =
  | Var
  | Pi
  | Fn
  | Ap
  | Sigma
  | Cons
  | Car
  | Cdr
  | Nat
  | Zero
  | Add1
  | NatInd
  | Equal
  | Same
  | Replace
  | Trivial
  | Sole
  | Absurd
  | AbsurdInd
  | Str
  | Quote
  | Type
  | begin
  | the

import * as Stmt from "../stmt"

export type v = Var
export const v = Var

export type pi = Pi
export const pi = Pi

export type fn = Fn
export const fn = Fn

export type ap = Ap
export const ap = Ap

export type sigma = Sigma
export const sigma = Sigma

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

export type begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const begin = (stmts: Array<Stmt.Stmt>, ret: Exp): begin => ({
  kind: "Exp.begin",
  stmts,
  ret,
})

export type the = {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export const the = (t: Exp, exp: Exp): the => ({
  kind: "Exp.the",
  t,
  exp,
})
