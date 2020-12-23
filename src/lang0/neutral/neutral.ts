import { VarNeutral } from "../exps/var-neutral"
import { ApNeutral } from "../exps/ap-neutral"

export type Neutral = VarNeutral | ApNeutral

export type v = VarNeutral
export const v = VarNeutral

export type ap = ApNeutral
export const ap = ApNeutral
