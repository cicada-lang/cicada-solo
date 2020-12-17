import { Exp } from "../exp"
import { Value } from "../value"
import { Mod } from "../mod"
import { Ctx } from "../ctx"

export type Readbackable = {
  readback_as: (value: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}
