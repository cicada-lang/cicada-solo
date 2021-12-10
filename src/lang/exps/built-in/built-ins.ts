import * as Exps from "../../exps"
import { Value } from "../../value"

// NOTE The `built-ins` can not be redefined at top level,
//   but can be scoped in local function scope.

class BuiltIns {
  values: Map<string, Exps.BuiltInValue>

  constructor(values: Map<string, Exps.BuiltInValue> = new Map()) {
    this.values = values
  }

  find_value(name: string): Exps.BuiltInValue | undefined {
    return this.values.get(name)
  }

  find_type(name: string): Value | undefined {
    return this.values.get(name)?.self_type()
  }

  register(value: Exps.BuiltInValue): this {
    const found = this.find_value(value.name)
    if (found !== undefined) {
      throw new Error(
        `I can not re-register built-in value of name: ${value.name}`
      )
    }

    this.values.set(value.name, value)
    return this
  }
}

export const built_ins = new BuiltIns().register(new Exps.TheValue())
