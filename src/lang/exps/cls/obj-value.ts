import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"

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

  get(name: string): Value {
    const value = this.properties.get(name)
    if (value === undefined) {
      throw new ElaborationError(
        `The property name: ${name} of object is undefined.`,
      )
    }

    return value
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.ObjValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    for (const [name, this_property] of this.properties) {
      const that_property = that.properties.get(name)
      if (that_property) {
        solution = solution.unify(
          ctx,
          Exps.DotCore.apply(t, name),
          this_property,
          that_property,
        )
      }
    }

    return solution
  }
}
