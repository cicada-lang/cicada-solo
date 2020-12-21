import { Var } from "../exps/var"
import { Pi } from "../exps/pi"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"

export type Exp =
  | Var
  | Pi
  | Fn
  | Ap
  | sigma
  | cons
  | car
  | cdr
  | nat
  | zero
  | add1
  | nat_ind
  | equal
  | same
  | replace
  | trivial
  | sole
  | absurd
  | absurd_ind
  | str
  | quote
  | type
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

export type sigma = {
  kind: "Exp.sigma"
  name: string
  car_t: Exp
  cdr_t: Exp
}

export const sigma = (name: string, car_t: Exp, cdr_t: Exp): sigma => ({
  kind: "Exp.sigma",
  name,
  car_t,
  cdr_t,
})

export type cons = {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export const cons = (car: Exp, cdr: Exp): cons => ({
  kind: "Exp.cons",
  car,
  cdr,
})

export type car = {
  kind: "Exp.car"
  target: Exp
}

export const car = (target: Exp): car => ({
  kind: "Exp.car",
  target,
})

export type cdr = {
  kind: "Exp.cdr"
  target: Exp
}

export const cdr = (target: Exp): cdr => ({
  kind: "Exp.cdr",
  target,
})

export type nat = {
  kind: "Exp.nat"
}

export const nat: nat = { kind: "Exp.nat" }

export type zero = {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

export type add1 = {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({
  kind: "Exp.add1",
  prev,
})

export type nat_ind = {
  kind: "Exp.nat_ind"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp
}

export const nat_ind = (
  target: Exp,
  motive: Exp,
  base: Exp,
  step: Exp
): nat_ind => ({
  kind: "Exp.nat_ind",
  target,
  motive,
  base,
  step,
})

export type equal = {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export const equal = (t: Exp, from: Exp, to: Exp): equal => ({
  kind: "Exp.equal",
  t,
  from,
  to,
})

export type same = {
  kind: "Exp.same"
}

export const same: same = {
  kind: "Exp.same",
}

export type replace = {
  kind: "Exp.replace"
  target: Exp
  motive: Exp
  base: Exp
}

export const replace = (target: Exp, motive: Exp, base: Exp): replace => ({
  kind: "Exp.replace",
  target,
  motive,
  base,
})

export type trivial = {
  kind: "Exp.trivial"
}

export const trivial: trivial = {
  kind: "Exp.trivial",
}

export type sole = {
  kind: "Exp.sole"
}

export const sole: sole = {
  kind: "Exp.sole",
}

export type absurd = {
  kind: "Exp.absurd"
}

export const absurd: absurd = {
  kind: "Exp.absurd",
}

export type absurd_ind = {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export const absurd_ind = (target: Exp, motive: Exp): absurd_ind => ({
  kind: "Exp.absurd_ind",
  target,
  motive,
})

export type str = {
  kind: "Exp.str"
}

export const str: str = {
  kind: "Exp.str",
}

export type quote = {
  kind: "Exp.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Exp.quote",
  str,
})

export type type = {
  kind: "Exp.type"
}

export const type: type = {
  kind: "Exp.type",
}

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
