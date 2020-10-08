import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function readback(ctx: Ctx.Ctx, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Exp.v(neutral.name)
    }
    case "Neutral.ap": {
      return Exp.ap(
        Neutral.readback(ctx, neutral.target),
        Normal.readback(ctx, neutral.arg)
      )
    }
    case "Neutral.dot": {
      return Exp.dot(Neutral.readback(ctx, neutral.target), neutral.name)
    }
    case "Neutral.replace": {
      return Exp.replace(
        Neutral.readback(ctx, neutral.target),
        Normal.readback(ctx, neutral.motive),
        Normal.readback(ctx, neutral.base)
      )
    }
    case "Neutral.absurd_ind": {
      return Exp.absurd_ind(
        Neutral.readback(ctx, neutral.target),
        Normal.readback(ctx, neutral.motive)
      )
    }
  }
}
