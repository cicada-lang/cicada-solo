import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function readback(
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
        Neutral.readback(mod, ctx, neutral.target),
        Normal.readback(mod, ctx, neutral.arg)
      )
    }
    case "Neutral.match": {
      throw new Error("TODO")
      // return Exp.ap(
      //   Neutral.readback(mod, ctx, neutral.target),
      //   Normal.readback(mod, ctx, neutral.arg)
      // )
    }
    case "Neutral.dot": {
      return Exp.dot(Neutral.readback(mod, ctx, neutral.target), neutral.name)
    }
    case "Neutral.replace": {
      return Exp.replace(
        Neutral.readback(mod, ctx, neutral.target),
        Normal.readback(mod, ctx, neutral.motive),
        Normal.readback(mod, ctx, neutral.base)
      )
    }
    case "Neutral.absurd_ind": {
      return Exp.absurd_ind(
        Neutral.readback(mod, ctx, neutral.target),
        Normal.readback(mod, ctx, neutral.motive)
      )
    }
  }
}
