import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function readback_neutral(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  neutral: Neutral.Neutral
): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return Exp.v(neutral.name)
    }
    case "Neutral.ap": {
      return Exp.ap(
        Readback.readback_neutral(mod, ctx, neutral.target),
        Readback.readback_normal(mod, ctx, neutral.arg)
      )
    }
    case "Neutral.match": {
      return Exp.ap(
        Readback.readback_normal(
          mod,
          ctx,
          Normal.create(neutral.pi, neutral.case_fn)
        ),
        Readback.readback_neutral(mod, ctx, neutral.arg)
      )
    }
    case "Neutral.dot": {
      return Exp.dot(
        Readback.readback_neutral(mod, ctx, neutral.target),
        neutral.name
      )
    }
    case "Neutral.replace": {
      return Exp.replace(
        Readback.readback_neutral(mod, ctx, neutral.target),
        Readback.readback_normal(mod, ctx, neutral.motive),
        Readback.readback_normal(mod, ctx, neutral.base)
      )
    }
    case "Neutral.absurd_ind": {
      return Exp.absurd_ind(
        Readback.readback_neutral(mod, ctx, neutral.target),
        Readback.readback_normal(mod, ctx, neutral.motive)
      )
    }
  }
}
