import * as Exp from "../exp"
import * as Env from "../env"
import * as Neu from "../neutral"

export type Value = Fn | Neutral

export interface Fn {
  kind: "Value.Fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export interface Neutral {
  kind: "Value.Neutral"
  neutral: Neu.Neutral
}
