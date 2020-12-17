import { Exp } from "../exp"
import { Value } from "../value"
import { Mod } from "../mod"
import { Ctx } from "../ctx"

// NOTE We need to do typed readback,
//   take Pi for example, we can not only readback Fn,
//   but also NotYetValue value that shall be Fn.

export type Readbackable = {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}

export function Readbackable(the: {
  readbackability: (t: Value, the: { mod: Mod; ctx: Ctx }) => Exp
}): Readbackable {
  return the
}
