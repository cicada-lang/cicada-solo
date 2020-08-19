import * as Value from "../value"

export type Neutral = v | ap

export interface v {
  kind: "Neutral.v"
  name: string
}

export interface ap {
  kind: "Neutral.ap"
  target: Neutral
  arg: Value.Value
}
