import * as Exp from "../exp"

export type Value = Fn

export const enum Kind {
  Fn = "Fn",
}

export interface Fn {
  kind: Kind.Fn
  name: string
  body: Exp.Exp
  // env: Env.Env
}
