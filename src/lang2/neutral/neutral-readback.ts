import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function readback(ctx: Ctx.Ctx, neutral: Neutral.Neutral): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.Var": {
      return {
        kind: "Exp.Var",
        name: neutral.name,
      }
    }
    case "Neutral.Ap": {
      return {
        kind: "Exp.Ap",
        target: Neutral.readback(ctx, neutral.target),
        arg: Normal.readback(ctx, neutral.arg),
      }
    }
    case "Neutral.Car": {
      return {
        kind: "Exp.Car",
        target: Neutral.readback(ctx, neutral.target),
      }
    }
    case "Neutral.Cdr": {
      return {
        kind: "Exp.Cdr",
        target: Neutral.readback(ctx, neutral.target),
      }
    }
    case "Neutral.NatInd": {
      return {
        kind: "Exp.NatInd",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
        base: Normal.readback(ctx, neutral.base),
        step: Normal.readback(ctx, neutral.step),
      }
    }
    case "Neutral.Replace": {
      return {
        kind: "Exp.Replace",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
        base: Normal.readback(ctx, neutral.base),
      }
    }
    case "Neutral.AbsurdInd": {
      return {
        kind: "Exp.AbsurdInd",
        target: Neutral.readback(ctx, neutral.target),
        motive: Normal.readback(ctx, neutral.motive),
      }
    }
  }
}
