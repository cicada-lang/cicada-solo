import { Readbackable } from "../../readbackable"
import { Value } from "../../value"
import { Union } from "../../exps/union"
import { TypeTy } from "../../exps/type-ty"
import * as Readback from "../../readback"

export type UnionTy = Readbackable & {
  kind: "Value.union"
  left: Value
  right: Value
}

export function UnionTy(left: Value, right: Value): UnionTy {
  return {
    kind: "Value.union",
    left,
    right,
    ...Readbackable({
      readbackability: (t, { mod, ctx }) =>
        Union(
          Readback.readback(mod, ctx, TypeTy, left),
          Readback.readback(mod, ctx, TypeTy, right)
        ),
    }),
  }
}
