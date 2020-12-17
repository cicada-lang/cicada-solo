import { Exp } from "../exp"
import { Ty } from "../ty"
import { Mod } from "../mod"
import { Ctx } from "../ctx"

export type Readbackable = {
  readback_as: (t: Ty, the: { mod: Mod; ctx: Ctx }) => Exp
}
