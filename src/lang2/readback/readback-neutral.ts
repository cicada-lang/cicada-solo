import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import { Var, Ap } from "../exps"

export function readback_neutral(
  ctx: Ctx.Ctx,
  neutral: Neutral.Neutral
): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Var(neutral.name)
    }
    case "Neutral.ap": {
      return Ap(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.arg)
      )
    }
    case "Neutral.car": {
      return Exp.car(Readback.readback_neutral(ctx, neutral.target))
    }
    case "Neutral.cdr": {
      return Exp.cdr(Readback.readback_neutral(ctx, neutral.target))
    }
    case "Neutral.nat_ind": {
      return Exp.nat_ind(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive),
        Readback.readback_normal(ctx, neutral.base),
        Readback.readback_normal(ctx, neutral.step)
      )
    }
    case "Neutral.replace": {
      return Exp.replace(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive),
        Readback.readback_normal(ctx, neutral.base)
      )
    }
    case "Neutral.absurd_ind": {
      return Exp.absurd_ind(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive)
      )
    }
  }
}
