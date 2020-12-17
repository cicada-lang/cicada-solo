import { Ty } from "../../ty"
import { Readbackable } from "../../readbackable"
import { Absurd } from "../../exps/absurd"

export type AbsurdTy = Readbackable & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  readback_as: (t, { mod, ctx }) => Absurd,
}
