import * as Value from "../value"

export type Neutral = Var | Ap

export interface Var {
  kind: "Neutral.Var"
  name: string
}

export interface Ap {
  kind: "Neutral.Ap"
  rator: Neutral
  rand: Value.Value
}
