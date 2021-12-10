import * as Exps from "../../exps"
import { Value } from "../../value"

// NOTE The `built-ins` can not be redefined at top level,
//   but can be scoped in local function scope.

interface BuiltInEntry {
  t: Value
  value: Exps.BuiltInValue
}

class BuiltIns {
  entries: Map<string, BuiltInEntry> = new Map()

  find_value(name: string): Exps.BuiltInValue | undefined {
    const entry = this.entries.get(name)
    if (entry === undefined) return undefined
    return entry.value
  }

  find_type(name: string): Value | undefined {
    const entry = this.entries.get(name)
    if (entry === undefined) return undefined
    return entry.t
  }
}

export const built_ins = new BuiltIns()
