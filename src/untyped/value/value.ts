import * as Exp from "../exp"
import * as Env from "../env"

export type Value = Fn

export const enum Kind {
  Fn = "Fn",
}

export interface Fn {
  kind: Kind.Fn
  name: string
  body: Exp.Exp
  env: Env.Env
}
