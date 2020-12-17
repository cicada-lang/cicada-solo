import { Exp } from "../exp"
import { Value } from "../value"
import { Mod } from "../mod"
import { Ctx } from "../ctx"

export type Readbackable = {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}
