import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Neu from "../neutral"

export type Value = Neutral | Fn | Zero | Succ

export interface Neutral {
  kind: "Value.Neutral"
  t: Ty.Ty
  neutral: Neu.Neutral
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

export interface Succ {
  kind: "Value.Succ"
  prev: Value
}
