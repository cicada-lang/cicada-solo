import { Ty } from "../ty"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Str } from "../exps/str"
import { readback_type } from "../readback/readback-type"

export type StrValue = Ty & {
  kind: "Value.str"
}

export const StrValue: StrValue = {
  kind: "Value.str",
  typed_readback(value, { mod, ctx }) {
    return readback_type(mod, ctx, value)
  },
  readback_as_type({ mod, ctx }) {
    return Str
  },
}
