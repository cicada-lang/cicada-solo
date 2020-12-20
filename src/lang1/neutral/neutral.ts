import * as Ty from "../ty"
import * as Normal from "../normal"

import { VarNeutral } from "../exps/var-neutral"
import { ApNeutral } from "../exps/ap-neutral"
import { RecNeutral } from "../exps/rec-neutral"

export type Neutral = VarNeutral | ApNeutral | RecNeutral

export type v = VarNeutral
export const v = VarNeutral

export type ap = ApNeutral
export const ap = ApNeutral

export type rec = RecNeutral
export const rec = RecNeutral
