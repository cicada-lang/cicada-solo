import * as Normal from "../normal"

export type Neutral = v | ap | car | cdr | nat_ind | replace | absurd_ind

export interface v {
  kind: "Neutral.v"
  name: string
}

export interface ap {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal.Normal
}

export interface car {
  kind: "Neutral.car"
  target: Neutral
}

export interface cdr {
  kind: "Neutral.cdr"
  target: Neutral
}

export interface nat_ind {
  kind: "Neutral.nat_ind"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
  step: Normal.Normal
}

export interface replace {
  kind: "Neutral.replace"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
}

export interface absurd_ind {
  kind: "Neutral.absurd_ind"
  target: Neutral
  motive: Normal.Normal
}
