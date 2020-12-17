import { Ty } from "../../ty"
import { Absurd } from "../../exps/absurd"

export type AbsurdTy = Ty & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  typed_readback: (value, { mod, ctx }) => {
    throw new Error("TODO")
  },
  readback_as_type: ({ mod, ctx }) => Absurd,
}
