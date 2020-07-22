import * as Ty from "../ty"

export type Exp = Var | Fn | Ap | Zero | Add1 | Rec | Suite | The

export interface Var {
  kind: "Exp.Var"
  name: string
}

export interface Fn {
  kind: "Exp.Fn"
  name: string
  body: Exp
}

export interface Ap {
  kind: "Exp.Ap"
  target: Exp
  arg: Exp
}

export interface Suite {
  kind: "Exp.Suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}

export interface Zero {
  kind: "Exp.Zero"
}

export interface Add1 {
  kind: "Exp.Add1"
  prev: Exp
}

export interface Rec {
  kind: "Exp.Rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export interface The {
  kind: "Exp.The"
  t: Ty.Ty
  exp: Exp
}
