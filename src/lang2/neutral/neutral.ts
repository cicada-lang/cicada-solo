import * as Normal from "../normal"

export type Neutral = Var | Ap | Car | Cdr | NatInd | Replace | AbsurdInd

export interface Var {
  kind: "Neutral.Var"
  name: string
}

export interface Ap {
  kind: "Neutral.Ap"
  target: Neutral
  arg: Normal.Normal
}

export interface Car {
  kind: "Neutral.Car"
  target: Neutral
}

export interface Cdr {
  kind: "Neutral.Cdr"
  target: Neutral
}

export interface NatInd {
  kind: "Neutral.NatInd"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
  step: Normal.Normal
}

export interface Replace {
  kind: "Neutral.Replace"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
}

export interface AbsurdInd {
  kind: "Neutral.AbsurdInd"
  target: Neutral
  motive: Normal.Normal
}
