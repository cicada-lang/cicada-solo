import { Readbackable, ReadbackAsType } from "../../readbackable"
import { Type } from "../../exps/type"

export type TypeTy = Readbackable & {
  kind: "Value.type"
}

export const TypeTy: TypeTy = {
  kind: "Value.type",
  ...ReadbackAsType({
    readback_as_type: (_) => Type,
  }),
}
