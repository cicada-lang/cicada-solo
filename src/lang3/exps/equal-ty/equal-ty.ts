import { Value } from "../../value"
import { Equal } from "../../exps/equal"
import { TypeTy } from "../../exps/type-ty"
import * as Readback from "../../readback"
import { Readbackable, ReadbackAsType } from "../../readbackable"

export type EqualTy = Readbackable & {
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
    ...ReadbackAsType({
      readback_as_type: ({ mod, ctx }) =>
        Equal(
          Readback.readback(mod, ctx, TypeTy, t),
          Readback.readback(mod, ctx, t, from),
          Readback.readback(mod, ctx, t, to)
        ),
    }),
  }
}
