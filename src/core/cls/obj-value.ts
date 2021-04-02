import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Obj } from "@/core"

export class ObjValue {
  properties: Map<string, Value>

  constructor(properties: Map<string, Value>) {
    this.properties = properties
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // NOTE eta expand
    return undefined
  }
}
