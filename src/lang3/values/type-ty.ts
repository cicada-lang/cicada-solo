import { Ty } from "../ty"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Type } from "../exps/type"
import { readback_type } from "./readback-type"

export type TypeTy = Ty & {
  kind: "Value.type"
}

export const TypeTy: TypeTy = {
  kind: "Value.type",
  typed_readback(value, { mod, ctx }) {
    return readback_type(mod, ctx, value)
  },
  readback_as_type: ({ mod, ctx }) => Type,
}
