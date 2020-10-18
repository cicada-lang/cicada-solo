import * as Normal from "../normal"
import * as Value from "../value"

export type Neutral = v | ap | match | dot | replace | absurd_ind

interface v {
  kind: "Neutral.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Neutral.v",
  name,
})

interface ap {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal.Normal
}

export const ap = (target: Neutral, arg: Normal.Normal): ap => ({
  kind: "Neutral.ap",
  target,
  arg,
})

interface match {
  kind: "Neutral.match"
  case_fn: Value.case_fn
  pi: Value.pi
  arg: Neutral
}

export const match = (
  case_fn: Value.case_fn,
  pi: Value.pi,
  arg: Neutral
): match => ({
  kind: "Neutral.match",
  case_fn,
  pi,
  arg,
})

interface dot {
  kind: "Neutral.dot"
  target: Neutral
  name: string
}

export const dot = (target: Neutral, name: string): dot => ({
  kind: "Neutral.dot",
  target,
  name,
})

interface replace {
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

interface absurd_ind {
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
