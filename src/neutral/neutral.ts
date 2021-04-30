import { Core } from "../core"
import { Ctx } from "../ctx"

export type Neutral = {
  readback_neutral(ctx: Ctx): Core
}
