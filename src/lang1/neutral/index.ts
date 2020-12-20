export * from "./neutral"

import { VarNeutral } from "../exps/var-neutral"
import { ApNeutral } from "../exps/ap-neutral"
import { RecNeutral } from "../exps/rec-neutral"

export type v = VarNeutral
export const v = VarNeutral

export type ap = ApNeutral
export const ap = ApNeutral

export type rec = RecNeutral
export const rec = RecNeutral
