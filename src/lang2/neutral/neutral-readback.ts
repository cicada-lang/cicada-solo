import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function readback(ctx: Ctx.Ctx, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return {
        kind: "Exp.v",
        name: neutral.name,
      }
    }
    case "Neutral.ap": {
      return {
        kind: "Exp.ap",
        target: Neutral.readback(ctx, neutral.target),
        arg: Normal.readback(ctx, neutral.arg),
      }
    }
    case "Neutral.car": {
      return {
        kind: "Exp.car",
        target: Neutral.readback(ctx, neutral.target),
      }
    }
    case "Neutral.cdr": {
      return {
        kind: "Exp.cdr",
        target: Neutral.readback(ctx, neutral.target),
      }
    }
    case "Neutral.nat_ind": {
      return {
        kind: "Exp.nat_ind",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
        base: Normal.readback(ctx, neutral.base),
        step: Normal.readback(ctx, neutral.step),
      }
    }
    case "Neutral.replace": {
      return {
        kind: "Exp.replace",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
        base: Normal.readback(ctx, neutral.base),
      }
    }
    case "Neutral.absurd_ind": {
      return {
        kind: "Exp.absurd_ind",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
      }
    }
  }
}
