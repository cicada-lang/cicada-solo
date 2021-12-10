import * as Exps from "../../exps"

// NOTE The `built-ins` can not be redefined at top level,
//   but can be scoped in local function scope.

class BuiltIns {
  values: Map<string, Exps.BuiltInValue> = new Map()

  find_value(name: string): Exps.BuiltInValue | undefined {
    return this.values.get(name)
  }
}

export const built_ins = new BuiltIns()
