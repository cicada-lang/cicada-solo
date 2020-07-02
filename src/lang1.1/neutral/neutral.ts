import * as Ty from "../ty"
import * as Normal from "../normal"

export type Neutral = Var | Ap | Rec

export interface Var {
  kind: "Neutral.Var"
  t: Ty.Ty
  name: string
}

export interface Ap {
  kind: "Neutral.Ap"
  t: Ty.Ty
  target: Neutral
  arg: Normal.Normal
}

export interface Rec {
  kind: "Neutral.Rec"
  t: Ty.Ty
  ret_t: Ty.Ty
  target: Neutral
  base: Normal.Normal
  step: Normal.Normal
}
