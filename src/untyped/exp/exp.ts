export type Exp = Var | Fn | Ap | Suite

export const enum Kind {
  Var = "Var",
  Fn = "Fn",
  Ap = "Ap",
  Suite = "Suite",
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

export interface Suite {
  kind: Kind.Suite
  defs: Array<{ name: string, exp: Exp }>
  body: Exp
}
