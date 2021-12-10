import * as Exps from "../../exps"
import { Value } from "../../value"

// NOTE The `built-ins` can not be redefined at top level,
//   but can be scoped in local function scope.

class BuiltIns {
  values: Map<string, Exps.BuiltInValue> = new Map()

  find_value(name: string): Exps.BuiltInValue | undefined {
    return this.values.get(name)
  }

  find_type(name: string): Value | undefined {
    throw new Error("TODO")
  }
}

export const built_ins = new BuiltIns()
