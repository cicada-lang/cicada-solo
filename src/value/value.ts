import { Ctx } from "../ctx"
import { Exp } from "../exp"

export type Value = {
  readback(ctx: Ctx, t: Value): Exp | undefined
  eta_expand?(ctx: Ctx, value: Value): Exp
}
