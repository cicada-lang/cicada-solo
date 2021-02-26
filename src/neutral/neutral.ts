import { Exp } from "../exp"
import { Ctx } from "../ctx"

export type Neutral = {
  readback_neutral(ctx: Ctx): Exp
}

import { Normal } from "../normal"

import { CarNeutral } from "../core"
import { CdrNeutral } from "../core"
import { NatIndNeutral } from "../core"
import { ReplaceNeutral } from "../core"
import { AbsurdIndNeutral } from "../core"

type car = CarNeutral
export const car = (target: Neutral): car => new CarNeutral(target)

type cdr = CdrNeutral
export const cdr = (target: Neutral): cdr => new CdrNeutral(target)

type nat_ind = NatIndNeutral
export const nat_ind = (
  target: Neutral,
  motive: Normal,
  base: Normal,
  step: Normal
): nat_ind => new NatIndNeutral(target, motive, base, step)

type replace = ReplaceNeutral
export const replace = (
  target: Neutral,
  motive: Normal,
  base: Normal
): replace => new ReplaceNeutral(target, motive, base)

type absurd_ind = AbsurdIndNeutral
export const absurd_ind = (target: Neutral, motive: Normal): absurd_ind =>
  new AbsurdIndNeutral(target, motive)
