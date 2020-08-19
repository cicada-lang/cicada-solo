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

export interface v {
  kind: "Exp.v"
  name: string
}

export interface pi {
  kind: "Exp.pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export interface fn {
  kind: "Exp.fn"
  name: string
  body: Exp
}

export interface ap {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export interface sigma {
  kind: "Exp.sigma"
  name: string
  car_t: Exp
  cdr_t: Exp
}

export interface cons {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export interface car {
  kind: "Exp.car"
  target: Exp
}

export interface cdr {
  kind: "Exp.cdr"
  target: Exp
}

export interface nat {
  kind: "Exp.nat"
}

export interface zero {
  kind: "Exp.zero"
}

export interface add1 {
  kind: "Exp.add1"
  prev: Exp
}

export interface nat_ind {
  kind: "Exp.nat_ind"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp
}

export interface equal {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export interface same {
  kind: "Exp.same"
}

export interface replace {
  kind: "Exp.replace"
  target: Exp
  motive: Exp
  base: Exp
}

export interface trivial {
  kind: "Exp.trivial"
}

export interface sole {
  kind: "Exp.sole"
}

export interface absurd {
  kind: "Exp.absurd"
}

export interface absurd_ind {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export interface str {
  kind: "Exp.str"
}

export interface quote {
  kind: "Exp.quote"
  str: string
}

export interface type {
  kind: "Exp.type"
}

export interface suite {
  kind: "Exp.suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}

export interface the {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}
