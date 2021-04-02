import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Obj } from "@/core"

export class ObjValue {
  properties: Map<string, Value>

  constructor(opts: { properties: Map<string, Value> }) {
    this.properties = opts.properties
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // NOTE Sigma eta expand
    return undefined
  }
}
