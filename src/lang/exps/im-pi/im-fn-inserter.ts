import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import * as Exps from "../../exps"

export abstract class ImFnInserter {
  abstract insert_im_fn(ctx: Ctx, fn: Exp): Core
}
