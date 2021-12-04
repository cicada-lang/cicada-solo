import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class InductionNeutral extends Neutral {
  target: Neutral
  motive: Normal
  case_entries: Array<Exps.CaseNormalEntry>

  constructor(
    target: Neutral,
    motive: Normal,
    case_entries: Array<Exps.CaseNormalEntry>
  ) {
    super()
    this.target = target
    this.motive = motive
    this.case_entries = case_entries
  }

  readback_neutral(ctx: Ctx): Core {
    throw new Error("TODO")
  }

  unify(ctx: Ctx, solution: Solution, that: Neutral): Solution {
    throw new Error("TODO")
  }
}
