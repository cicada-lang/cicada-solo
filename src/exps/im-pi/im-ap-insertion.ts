import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImApInsertionEntry {
  arg_t: Value
  im_arg: Value
  not_yet_value: Exps.NotYetValue
}

export interface ImApInsertion {
  insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core }
}

export const ImApInsertion = {
  // NOTE A type guard for type-based implicit application insertion.
  based_on(t: Value): t is Value & ImApInsertion {
    return (t as any)["insert_im_ap"] instanceof Function
  },
}
