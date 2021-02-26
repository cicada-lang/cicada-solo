import { Exp } from "../exp"
import { Ctx } from "../ctx"

export type Neutral = {
  readback_neutral(ctx: Ctx): Exp
}

import { Normal } from "../normal"

import { ReplaceNeutral } from "../core"
import { AbsurdIndNeutral } from "../core"

type replace = ReplaceNeutral
export const replace = (
  target: Neutral,
  motive: Normal,
  base: Normal
): replace => new ReplaceNeutral(target, motive, base)

type absurd_ind = AbsurdIndNeutral
export const absurd_ind = (target: Neutral, motive: Normal): absurd_ind =>
  new AbsurdIndNeutral(target, motive)
