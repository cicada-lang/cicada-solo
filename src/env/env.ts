import { Value } from "../value"

type EnvEntry = {
  t: Value
  value: Value
}

export class Env {
  entries: Map<string, EnvEntry>

  constructor(entries: Map<string, EnvEntry> = new Map()) {
    this.entries = entries
  }

  extend(name: string, t: Value, value: Value): Env {
    return new Env(new Map([...this.entries, [name, { t, value }]]))
  }

  lookup_value(name: string): undefined | Value {
    const entry = this.entries.get(name)
    if (entry !== undefined) return entry.value
    else return undefined
  }

  lookup_type(name: string): undefined | Value {
    const entry = this.entries.get(name)
    if (entry !== undefined) return entry.t
    else return undefined
  }
}
