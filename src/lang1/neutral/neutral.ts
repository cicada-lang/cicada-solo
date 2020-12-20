import * as Ty from "../ty"
import * as Normal from "../normal"

import { VarNeutral } from "../exps/var-neutral"

export type Neutral = VarNeutral | ap | rec

export type v = VarNeutral
export const v = VarNeutral

export type ap = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Normal.Normal
}

export const ap = (target: Neutral, arg: Normal.Normal): ap => ({
  kind: "Neutral.ap",
  target,
  arg,
})

export type rec = {
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
