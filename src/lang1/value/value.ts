import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neutral from "../neutral"

export type Value = Reflection | Fn | Zero | Add1

export interface Reflection {
  kind: "Value.Reflection"
  t: Ty.Ty
  neutral: Neutral.Neutral
}

export interface Fn {
  kind: "Value.Fn"
  name: string
  body: Exp.Exp
  env: Env.Env
}

export interface Zero {
  kind: "Value.Zero"
}

export interface Add1 {
  kind: "Value.Add1"
  prev: Value
}
