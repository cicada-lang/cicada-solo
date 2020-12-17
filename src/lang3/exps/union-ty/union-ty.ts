import { ReadbackAsType } from "../../readback-as-type"
import { Value } from "../../value"
import { Union } from "../../exps/union"
import { readback_type } from "../readback-type"

export type UnionTy = ReadbackAsType & {
  kind: "Value.union"
  left: Value
  right: Value
}

export function UnionTy(left: Value, right: Value): UnionTy {
  return {
    kind: "Value.union",
    left,
    right,
    ...ReadbackAsType({
      readback_as_type: ({ mod, ctx }) =>
        Union(readback_type(mod, ctx, left), readback_type(mod, ctx, right)),
    }),
  }
}
