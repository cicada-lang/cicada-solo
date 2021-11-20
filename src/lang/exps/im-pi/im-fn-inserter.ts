import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"

export abstract class ImFnInserter {
  abstract insert_im_fn(ctx: Ctx, fn: Exp): Core
}
