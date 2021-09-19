import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, solve } from "../../value"
import { Closure } from "../closure"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import { ImApInsertion } from "./im-ap-insertion"
import { ImFnInsertion } from "./im-fn-insertion"
import { ReadbackEtaExpansion } from "../../value"

export abstract class ImPiValue
  extends Value
  implements ReadbackEtaExpansion, ImFnInsertion, ImApInsertion
{
  instanceofImPiValue = true

  abstract readback_eta_expansion(ctx: Ctx, value: Value): Core
  abstract insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core
  abstract insert_im_ap(
    ctx: Ctx,
    ap: Exps.Ap,
    core: Core
  ): { t: Value; core: Core }
}
