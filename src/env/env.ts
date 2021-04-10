import { Value } from "../value"

export class Env {
  values: Map<string, Value>

  constructor(values: Map<string, Value> = new Map()) {
    this.values = values
  }

  extend(name: string, value: Value): Env {
    return new Env(new Map([...this.values, [name, value]]))
  }

  lookup(name: string): undefined | Value {
    return this.values.get(name)
  }
}
