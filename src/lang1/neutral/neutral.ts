import * as Ty from "../ty"
import * as Normal from "../normal"

export type Neutral = v | ap | rec

export interface v {
  kind: "Neutral.v"
  name: string
}

export interface ap {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal.Normal
}

export interface rec {
  kind: "Neutral.rec"
  ret_t: Ty.Ty
  target: Neutral
  base: Normal.Normal
  step: Normal.Normal
}
