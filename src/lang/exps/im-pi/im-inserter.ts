import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion } from "../../value"

export interface ImApInsertionEntry {
  arg_t: Value
  im_arg: Value
  not_yet_value: Exps.NotYetValue
}

export abstract class ImInserter {
  abstract insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core

  abstract insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core }

  abstract solve_im_ap(ctx: Ctx, arg: Exp): Solution
}
