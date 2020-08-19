import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = fn | reflection

export interface fn {
  kind: "Value.fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export interface reflection {
  kind: "Value.reflection"
  neutral: Neutral.Neutral
}
