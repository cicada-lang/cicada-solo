import { Ty } from "../../ty"
import { Readbackable } from "../../readbackable"
import { Absurd } from "../../exps/absurd"

export type AbsurdTy = Readbackable & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  readbackability: (t, { mod, ctx }) => Absurd,
}
