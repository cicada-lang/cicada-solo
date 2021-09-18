import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Trace } from "../../errors"
import * as ut from "../../ut"

export class ObjValue extends Value {
  properties: Map<string, Value>

  constructor(properties: Map<string, Value>) {
    super()
    this.properties = properties
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }

  dot_value(name: string): Value {
    const value = this.properties.get(name)
    if (value === undefined) {
      throw new Trace(
        ut.aline(`
          |The property name: ${name} of object is undefined.
          |`)
      )
    }

    return value
  }
}
