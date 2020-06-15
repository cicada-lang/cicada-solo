export type Exp = Var | Fn | Ap

export const enum Kind {
  Var = "Var",
  Fn = "Fn",
  Ap = "Ap",
}

export interface Var {
  kind: Kind.Var
  name: string
}

export interface Fn {
  kind: Kind.Fn
  name: string
  body: Exp
}

export interface Ap {
  kind: Kind.Ap
  rator: Exp
  rand: Exp
}
