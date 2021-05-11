import { Value } from "../value"

export class Env {
  values: Map<string, Value>

  constructor(values: Map<string, Value> = new Map()) {
    this.values = values
  }

  extend(name: string, value: Value): Env {
    return new Env(new Map([...this.values, [name, value]]))
  }

  extend_by_values(values: Map<string, Value>): Env {
    return new Env(new Map([...this.values, ...values]))
  }

  lookup_value(name: string): undefined | Value {
    const value = this.values.get(name)
    if (value !== undefined) return value
    else return undefined
  }
}
