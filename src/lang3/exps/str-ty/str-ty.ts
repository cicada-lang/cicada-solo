import { ReadbackAsType } from "../../readback-as-type"
import { Str } from "../../exps/str"

export type StrTy = ReadbackAsType & {
  kind: "Value.str"
}

export const StrTy: StrTy = {
  kind: "Value.str",
  ...ReadbackAsType({
    readback_as_type: (_) => Str,
  }),
}
