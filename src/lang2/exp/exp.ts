import * as Stmt from "../stmt"

export type Exp =
  | v
  | pi
  | fn
  | ap
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

type v = {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
})

type pi = {
  kind: "Exp.pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export const pi = (name: string, arg_t: Exp, ret_t: Exp): pi => ({
  kind: "Exp.pi",
  name,
  arg_t,
  ret_t,
})

type fn = {
  kind: "Exp.fn"
  name: string
  ret: Exp
}

export const fn = (name: string, ret: Exp): fn => ({
  kind: "Exp.fn",
  name,
  ret,
})

type ap = {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

type sigma = {
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

type cons = {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export const cons = (car: Exp, cdr: Exp): cons => ({
  kind: "Exp.cons",
  car,
  cdr,
})

type car = {
  kind: "Exp.car"
  target: Exp
}

export const car = (target: Exp): car => ({
  kind: "Exp.car",
  target,
})

type cdr = {
  kind: "Exp.cdr"
  target: Exp
}

export const cdr = (target: Exp): cdr => ({
  kind: "Exp.cdr",
  target,
})

type nat = {
  kind: "Exp.nat"
}

export const nat: nat = { kind: "Exp.nat" }

type zero = {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

type add1 = {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({
  kind: "Exp.add1",
  prev,
})

type nat_ind = {
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

type equal = {
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

type same = {
  kind: "Exp.same"
}

export const same: same = {
  kind: "Exp.same",
}

type replace = {
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

type trivial = {
  kind: "Exp.trivial"
}

export const trivial: trivial = {
  kind: "Exp.trivial",
}

type sole = {
  kind: "Exp.sole"
}

export const sole: sole = {
  kind: "Exp.sole",
}

type absurd = {
  kind: "Exp.absurd"
}

export const absurd: absurd = {
  kind: "Exp.absurd",
}

type absurd_ind = {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export const absurd_ind = (target: Exp, motive: Exp): absurd_ind => ({
  kind: "Exp.absurd_ind",
  target,
  motive,
})

type str = {
  kind: "Exp.str"
}

export const str: str = {
  kind: "Exp.str",
}

type quote = {
  kind: "Exp.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Exp.quote",
  str,
})

type type = {
  kind: "Exp.type"
}

export const type: type = {
  kind: "Exp.type",
}

type begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const begin = (stmts: Array<Stmt.Stmt>, ret: Exp): begin => ({
  kind: "Exp.begin",
  stmts,
  ret,
})

type the = {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export const the = (t: Exp, exp: Exp): the => ({
  kind: "Exp.the",
  t,
  exp,
})
