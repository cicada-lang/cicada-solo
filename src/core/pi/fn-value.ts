import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Closure } from "@/closure"

export class FnValue {
  ret_cl: Closure

  constructor(ret_cl: Closure) {
    this.ret_cl = ret_cl
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // NOTE Pi eta expand
    return undefined
  }
}
