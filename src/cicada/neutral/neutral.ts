import * as Normal from "../normal"

export type Neutral = v | ap | car | cdr | nat_ind | replace | absurd_ind

type v = {
  kind: "Neutral.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Neutral.v",
  name,
})

type ap = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal.Normal
}

export const ap = (target: Neutral, arg: Normal.Normal): ap => ({
  kind: "Neutral.ap",
  target,
  arg,
})

type car = {
  kind: "Neutral.car"
  target: Neutral
}

export const car = (target: Neutral): car => ({
  kind: "Neutral.car",
  target,
})

type cdr = {
  kind: "Neutral.cdr"
  target: Neutral
}

export const cdr = (target: Neutral): cdr => ({
  kind: "Neutral.cdr",
  target,
})

type nat_ind = {
  kind: "Neutral.nat_ind"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
  step: Normal.Normal
}

export const nat_ind = (
  target: Neutral,
  motive: Normal.Normal,
  base: Normal.Normal,
  step: Normal.Normal
): nat_ind => ({
  kind: "Neutral.nat_ind",
  target,
  motive,
  base,
  step,
})

type replace = {
  kind: "Neutral.replace"
  target: Neutral
  motive: Normal.Normal
  base: Normal.Normal
}

export const replace = (
  target: Neutral,
  motive: Normal.Normal,
  base: Normal.Normal
): replace => ({
  kind: "Neutral.replace",
  target,
  motive,
  base,
})

type absurd_ind = {
  kind: "Neutral.absurd_ind"
  target: Neutral
  motive: Normal.Normal
}

export const absurd_ind = (
  target: Neutral,
  motive: Normal.Normal
): absurd_ind => ({
  kind: "Neutral.absurd_ind",
  target,
  motive,
})
