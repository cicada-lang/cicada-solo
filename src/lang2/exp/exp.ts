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
  | suite
  | the

interface v {
  kind: "Exp.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Exp.v",
  name,
})

interface pi {
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

interface fn {
  kind: "Exp.fn"
  name: string
  ret: Exp
}

export const fn = (name: string, ret: Exp): fn => ({
  kind: "Exp.fn",
  name,
  ret,
})

interface ap {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export const ap = (target: Exp, arg: Exp): ap => ({
  kind: "Exp.ap",
  target,
  arg,
})

interface sigma {
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

interface cons {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export const cons = (car: Exp, cdr: Exp): cons => ({
  kind: "Exp.cons",
  car,
  cdr,
})

interface car {
  kind: "Exp.car"
  target: Exp
}

export const car = (target: Exp): car => ({
  kind: "Exp.car",
  target,
})

interface cdr {
  kind: "Exp.cdr"
  target: Exp
}

export const cdr = (target: Exp): cdr => ({
  kind: "Exp.cdr",
  target,
})

interface nat {
  kind: "Exp.nat"
}

export const nat: nat = { kind: "Exp.nat" }

interface zero {
  kind: "Exp.zero"
}

export const zero: zero = { kind: "Exp.zero" }

interface add1 {
  kind: "Exp.add1"
  prev: Exp
}

export const add1 = (prev: Exp): add1 => ({
  kind: "Exp.add1",
  prev,
})

interface nat_ind {
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

interface equal {
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

interface same {
  kind: "Exp.same"
}

export const same: same = {
  kind: "Exp.same",
}

interface replace {
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

interface trivial {
  kind: "Exp.trivial"
}

export const trivial: trivial = {
  kind: "Exp.trivial",
}

interface sole {
  kind: "Exp.sole"
}

export const sole: sole = {
  kind: "Exp.sole",
}

interface absurd {
  kind: "Exp.absurd"
}

export const absurd: absurd = {
  kind: "Exp.absurd",
}

interface absurd_ind {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export const absurd_ind = (target: Exp, motive: Exp): absurd_ind => ({
  kind: "Exp.absurd_ind",
  target,
  motive,
})

interface str {
  kind: "Exp.str"
}

export const str: str = {
  kind: "Exp.str",
}

interface quote {
  kind: "Exp.quote"
  str: string
}

export const quote = (str: string): quote => ({
  kind: "Exp.quote",
  str,
})

interface type {
  kind: "Exp.type"
}

export const type: type = {
  kind: "Exp.type",
}

interface suite {
  kind: "Exp.suite"
  defs: Array<{ name: string; exp: Exp }>
  ret: Exp
}

export const suite = (
  defs: Array<{ name: string; exp: Exp }>,
  ret: Exp
): suite => ({
  kind: "Exp.suite",
  defs,
  ret,
})

interface the {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export const the = (t: Exp, exp: Exp): the => ({
  kind: "Exp.the",
  t,
  exp,
})
