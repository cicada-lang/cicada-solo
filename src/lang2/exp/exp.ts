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
  | Succ
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
  | Suite
  | The

export interface Var {
  kind: "Exp.Var"
  name: string
}

export interface Pi {
  kind: "Exp.Pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export interface Fn {
  kind: "Exp.Fn"
  name: string
  body: Exp
}

export interface Ap {
  kind: "Exp.Ap"
  rator: Exp
  rand: Exp
}

export interface Sigma {
  kind: "Exp.Sigma"
  name: string
  car_t: Exp
  cdr_t: Exp
}

export interface Cons {
  kind: "Exp.Cons"
  car: Exp
  cdr: Exp
}

export interface Car {
  kind: "Exp.Car"
  cons: Exp
}

export interface Cdr {
  kind: "Exp.Cdr"
  cons: Exp
}

export interface Nat {
  kind: "Exp.Nat"
}

export interface Zero {
  kind: "Exp.Zero"
}

export interface Succ {
  kind: "Exp.Succ"
  prev: Exp
}

export interface NatInd {
  kind: "Exp.NatInd"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp
}

export interface Equal {
  kind: "Exp.Equal"
  t: Exp
  from: Exp
  to: Exp
}

export interface Same {
  kind: "Exp.Same"
}

export interface Replace {
  kind: "Exp.Replace"
  target: Exp
  motive: Exp
  base: Exp
}

export interface Trivial {
  kind: "Exp.Trivial"
}

export interface Sole {
  kind: "Exp.Sole"
}

export interface Absurd {
  kind: "Exp.Absurd"
}

export interface AbsurdInd {
  kind: "Exp.AbsurdInd"
  target: Exp
  motive: Exp
}

export interface Str {
  kind: "Exp.Str"
}

export interface Quote {
  kind: "Exp.Quote"
}

export interface Type {
  kind: "Exp.Type"
}

export interface Suite {
  kind: "Exp.Suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}

export interface The {
  kind: "Exp.The"
  t: Exp
  exp: Exp
}
