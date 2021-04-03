import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Obj } from "@/core"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class ObjValue {
  properties: Map<string, Value>

  constructor(properties: Map<string, Value>) {
    this.properties = properties
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // NOTE eta expand
    return undefined
  }

  dot(name: string): Value {
    const value = this.properties.get(name)
    if (value === undefined) {
      throw new Trace(
        ut.aline(`
          |The property name of objectis undefined.
          |  ${name}
          |`)
      )
    }

    return value
  }
}
