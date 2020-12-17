import { Absurd } from "../../exps/absurd"
import { Readbackable, ReadbackAsType } from "../../readbackable"

export type AbsurdTy = Readbackable & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  ...ReadbackAsType({
    readback_as_type: ({ mod, ctx }) => Absurd,
  }),
}
