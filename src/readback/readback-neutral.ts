import * as Readback from "../readback"
import * as Neutral from "../neutral"
import * as Normal from "../normal"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import { Var } from "../core"
import { Ap } from "../core"
import { Car, Cdr } from "../core"
import { NatInd } from "../core"
import { Replace } from "../core"
import { AbsurdInd } from "../core"

export function readback_neutral(
  ctx: Ctx.Ctx,
  neutral: Neutral.Neutral
): Exp.Exp {
  switch (neutral.kind) {
    case "Neutral.v": {
      return new Var(neutral.name)
    }
    case "Neutral.ap": {
      return new Ap(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.arg)
      )
    }
    case "Neutral.car": {
      return new Car(Readback.readback_neutral(ctx, neutral.target))
    }
    case "Neutral.cdr": {
      return new Cdr(Readback.readback_neutral(ctx, neutral.target))
    }
    case "Neutral.nat_ind": {
      return new NatInd(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive),
        Readback.readback_normal(ctx, neutral.base),
        Readback.readback_normal(ctx, neutral.step)
      )
    }
    case "Neutral.replace": {
      return new Replace(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive),
        Readback.readback_normal(ctx, neutral.base)
      )
    }
    case "Neutral.absurd_ind": {
      return new AbsurdInd(
        Readback.readback_neutral(ctx, neutral.target),
        Readback.readback_normal(ctx, neutral.motive)
      )
    }
  }
}
