import * as Normal from "../normal"

export type Neutral = Var | Ap | Car | Cdr | NatInd | Replace | AbsurdInd

export interface Var {
  kind: "Neutral.Var"
  name: string
}

export interface Ap {
  kind: "Neutral.Ap"
  rator: Neutral
  rand: Normal.Normal
}

export interface Car {
  kind: "Neutral.Car"
  cons: Neutral
}

export interface Cdr {
  kind: "Neutral.Cdr"
  cons: Neutral
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
