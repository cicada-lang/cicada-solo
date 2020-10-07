import * as Normal from "../normal"

export type Neutral =
  | v
  | ap
  // | dot
  | replace
  | absurd_ind

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
