import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImApInsertion {
  insert_im_ap(ctx: Ctx, ap: Exps.Ap, core: Core): { t: Value; core: Core }
}

export const ImApInsertion = {
  // NOTE A type guard for type-based implicit application insertion.
  based_on(value: Value): value is Value & ImApInsertion {
    return (value as any)["insert_im_ap"] !== undefined
  },
}
