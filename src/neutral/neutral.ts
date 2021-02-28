import { Exp } from "@/exp"
import { Ctx } from "@/ctx"

export type Neutral = {
  readback_neutral(ctx: Ctx): Exp
}
