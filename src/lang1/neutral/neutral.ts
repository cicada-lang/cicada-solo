import * as Ty from "../ty"
import * as Normal from "../normal"

export type Neutral = v | ap | rec

interface v {
  kind: "Neutral.v"
  name: string
}

export const v = (name: string): v => ({ kind: "Neutral.v", name })

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

interface rec {
  kind: "Neutral.rec"
  ret_t: Ty.Ty
  target: Neutral
  base: Normal.Normal
  step: Normal.Normal
}

export const rec = (
  ret_t: Ty.Ty,
  target: Neutral,
  base: Normal.Normal,
  step: Normal.Normal
): rec => ({
  kind: "Neutral.rec",
  ret_t,
  target,
  base,
  step,
})
