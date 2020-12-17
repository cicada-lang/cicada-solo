import { Absurd } from "../../exps/absurd"
import { ReadbackAsType } from "../../readback-as-type"

export type AbsurdTy = ReadbackAsType & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  ...ReadbackAsType({
    readback_as_type: ({ mod, ctx }) => Absurd,
  }),
}
