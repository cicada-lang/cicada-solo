import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = reflection | fn | zero | add1

export interface reflection {
  kind: "Value.reflection"
  t: Ty.Ty
  neutral: Neutral.Neutral
}

export interface fn {
  kind: "Value.fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export interface zero {
  kind: "Value.zero"
}

export interface add1 {
  kind: "Value.add1"
  prev: Value
}
