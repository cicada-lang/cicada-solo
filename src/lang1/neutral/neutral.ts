import * as Ty from "../ty"
import * as Normal from "../normal"

import { VarNeutral } from "../exps/var-neutral"
import { ApNeutral } from "../exps/ap-neutral"

export type Neutral = VarNeutral | ApNeutral | rec

export type v = VarNeutral
export const v = VarNeutral

export type ap = ApNeutral
export const ap = ApNeutral

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
