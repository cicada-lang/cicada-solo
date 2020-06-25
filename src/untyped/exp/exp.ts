export type Exp = Var | Fn | Ap | Suite

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
  rator: Exp
  rand: Exp
}

export interface Suite {
  kind: "Exp.Suite"
  defs: Array<{ name: string; exp: Exp }>
  body: Exp
}
