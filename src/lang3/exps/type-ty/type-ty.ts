import { ReadbackAsType } from "../../readback-as-type"
import { Type } from "../../exps/type"
import { Ty } from "../../ty"

export type TypeTy = ReadbackAsType & {
  kind: "Value.type"
}

export const TypeTy: TypeTy = {
  kind: "Value.type",
  ...ReadbackAsType({
    readback_as_type: (_) => Type,
  }),
}
