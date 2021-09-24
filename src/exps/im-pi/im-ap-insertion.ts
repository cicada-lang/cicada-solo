import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImApInsertion {
  insert_im_ap(
    ctx: Ctx,
    ap: Exps.Ap,
    core: Core,
    args: Array<{ name: string; arg: Exp }>
  ): { t: Value; core: Core }
}

export const ImApInsertion = {
  // NOTE A type guard for type-based implicit application insertion.
  based_on(t: Value): t is Value & ImApInsertion {
    return (t as any)["insert_im_ap"] instanceof Function
  },
}
