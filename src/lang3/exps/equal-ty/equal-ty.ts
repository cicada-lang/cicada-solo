import { Ty } from "../../ty"
import { Value } from "../../value"
import { Equal } from "../../exps/equal"
import { readback_type } from "../readback-type"
import * as Readback from "../../readback"
import { Readbackable } from "../../readbackable"

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
      // TODO
      return (value as Readbackable).readback_as(this, { mod, ctx })
    },
    readback_as_type: ({ mod, ctx }) =>
      Equal(
        readback_type(mod, ctx, t),
        Readback.readback(mod, ctx, t, from),
        Readback.readback(mod, ctx, t, to)
      ),
  }
}
