import { Ty } from "../ty"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Absurd } from "../exps/absurd"
import { readback_type } from "../readback/readback-type"

export type AbsurdTy = Ty & {
  kind: "Value.absurd"
}

export const AbsurdTy: AbsurdTy = {
  kind: "Value.absurd",
  typed_readback(value, { mod, ctx }) {
    throw new Error("TODO")
  },
  readback_as_type({ mod, ctx }) {
    return Absurd
  },
}
