import { Ty } from "../../ty"
import { Type } from "../../exps/type"
import { readback_type } from "../readback-type"

export type TypeTy = Ty & {
  kind: "Value.type"
}

export const TypeTy: TypeTy = {
  kind: "Value.type",
  typed_readback: (value, { mod, ctx }) => readback_type(mod, ctx, value),
  readback_as_type: (_) => Type,
}
