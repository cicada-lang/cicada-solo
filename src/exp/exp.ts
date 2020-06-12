export type Exp = Var | Fn

export const enum Kind {
  Var = "Var",
  Fn = "Fn",
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
