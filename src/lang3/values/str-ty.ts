import { Ty } from "../ty"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Str } from "../exps/str"
import { readback_type } from "./readback-type"

export type StrTy = Ty & {
  kind: "Value.str"
}

export const StrTy: StrTy = {
  kind: "Value.str",
  typed_readback(value, { mod, ctx }) {
    throw new Error("TODO")
  },
  readback_as_type: ({ mod, ctx }) => Str,
}
