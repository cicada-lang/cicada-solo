import { Exp } from "../exp"
import { Value } from "../value"
import { Mod } from "../mod"
import { Ctx } from "../ctx"

export type Readbackable = {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}

export function Readbackable(the: {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}): Readbackable {
  return the
}

export function ReadbackAsType(the: {
  readback_as_type: (the: { mod: Mod; ctx: Ctx }) => Exp
}): Readbackable {
  return {
    readbackability: (_, { mod, ctx }) => the.readback_as_type({ mod, ctx })
  }
}
