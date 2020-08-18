import * as Ty from "../ty"

export type Exp = v | fn | ap | zero | add1 | rec | suite | the

export interface v {
  kind: "Exp.v"
  name: string
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

export interface suite {
  kind: "Exp.suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}

export interface zero {
  kind: "Exp.zero"
}

export interface add1 {
  kind: "Exp.add1"
  prev: Exp
}

export interface rec {
  kind: "Exp.rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export interface the {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}
