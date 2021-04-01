import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Obj } from "@/core"

export class ObjValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    throw new Error("TODO")
  }
}
