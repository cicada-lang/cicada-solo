import { Core } from "../core"
import { Ctx } from "../ctx"

export abstract class Neutral {
  abstract readback_neutral(ctx: Ctx): Core
}
