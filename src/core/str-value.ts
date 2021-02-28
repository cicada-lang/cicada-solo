import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { TypeValue } from "@/core"
import { Str } from "@/core"

export class StrValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Str()
    }
  }
}
