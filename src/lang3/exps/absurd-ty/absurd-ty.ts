import { Ty } from "../../ty"
import { Readbackable, ReadbackAsType } from "../../readbackable"
import { Absurd } from "../../exps/absurd"

export type AbsurdTy = Readbackable & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  ...ReadbackAsType({
    readback_as_type: ({ mod, ctx }) => Absurd,
  }),
}
