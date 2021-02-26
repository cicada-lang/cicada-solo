import { Exp } from "../exp"
import { Ctx } from "../ctx"

export type Neutral = {
  readback_neutral(ctx: Ctx): Exp
}

import { Normal } from "../normal"

import { AbsurdIndNeutral } from "../core"

type absurd_ind = AbsurdIndNeutral
export const absurd_ind = (target: Neutral, motive: Normal): absurd_ind =>
  new AbsurdIndNeutral(target, motive)
