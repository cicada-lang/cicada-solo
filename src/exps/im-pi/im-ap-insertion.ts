import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export interface ImApInsertion {
  insert_im_ap(ctx: Ctx, ap: Exps.Ap): { t: Value; core: Core }
}

// export const ImApInsertion = {
//   based_on():
// }
