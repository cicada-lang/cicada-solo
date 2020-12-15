import { Ty } from "../ty"
import { Value } from "../value"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Equal } from "../exps/equal"
import { readback_type } from "../readback/readback-type"
import * as Readback from "../readback"

export type EqualTy = Ty & {
  kind: "Value.equal"
  t: Value
  from: Value
  to: Value
}

export function EqualTy(t: Value, from: Value, to: Value): EqualTy {
  return {
    kind: "Value.equal",
    t,
    from,
    to,
    typed_readback(value, { mod, ctx }) {
      throw new Error("TODO")
    },
    readback_as_type({ mod, ctx }) {
      return Equal(
        readback_type(mod, ctx, t),
        Readback.readback(mod, ctx, t, from),
        Readback.readback(mod, ctx, t, to)
      )
    },
  }
}
