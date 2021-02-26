import * as Readback from "../readback"
import * as Neutral from "../neutral"
import { Normal } from "../normal"
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
      return neutral.readback_neutral(ctx)
    }
    case "Neutral.ap": {
      return neutral.readback_neutral(ctx)
    }
    case "Neutral.car": {
      return neutral.readback_neutral(ctx)
    }
    case "Neutral.cdr": {
      return new Cdr(Readback.readback_neutral(ctx, neutral.target))
    }
    case "Neutral.nat_ind": {
      return new NatInd(
        Readback.readback_neutral(ctx, neutral.target),
        neutral.motive.readback_normal(ctx),
        neutral.base.readback_normal(ctx),
        neutral.step.readback_normal(ctx)
      )
    }
    case "Neutral.replace": {
      return new Replace(
        Readback.readback_neutral(ctx, neutral.target),
        neutral.motive.readback_normal(ctx),
        neutral.base.readback_normal(ctx)
      )
    }
    case "Neutral.absurd_ind": {
      return neutral.readback_neutral(ctx)
    }
  }
}
