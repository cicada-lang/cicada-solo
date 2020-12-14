import { Value } from "../value"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Mod } from "../mod"

// NOTE Value might be Ty.
// - We need to do typed readback and dispatch by type,
//   take Pi for example, we can not only readback Fn,
//   but also NotYet value that shall be Fn.

export type Ty = {
  typed_readback(value: Value, the: { mod: Mod; ctx: Ctx }): Exp
  readback_as_type(the: { mod: Mod; ctx: Ctx }): Exp
}
