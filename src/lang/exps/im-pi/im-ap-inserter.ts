import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImApInsertionEntry {
  arg_t: Value
  im_arg: Value
  not_yet_value: Exps.NotYetValue
}

export abstract class ImApInserter {
  abstract insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core }

  abstract solve_im_ap(ctx: Ctx, arg: Exp): Solution
}
