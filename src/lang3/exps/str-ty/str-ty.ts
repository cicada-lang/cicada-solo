import { Readbackable, ReadbackAsType } from "../../readbackable"
import { Str } from "../../exps/str"

export type StrTy = Readbackable & {
  kind: "Value.str"
}

export const StrTy: StrTy = {
  kind: "Value.str",
  ...ReadbackAsType({
    readback_as_type: (_) => Str,
  }),
}
