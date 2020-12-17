import { Ty } from "../../ty"
import { Str } from "../../exps/str"

export type StrTy = Ty & {
  kind: "Value.str"
}

export const StrTy: StrTy = {
  kind: "Value.str",
  typed_readback: (value, { mod, ctx }) => {
    throw new Error("TODO")
  },
  readback_as_type: ({ mod, ctx }) => Str,
}
