import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = Fn | Reflection

export interface Fn {
  kind: "Value.Fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export interface Reflection {
  kind: "Value.Reflection"
  neutral: Neutral.Neutral
}
