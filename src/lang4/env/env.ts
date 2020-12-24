import { Value } from "../value"

export class Env {
  table: Map<string, Value>

  constructor(table?: Map<string, Value>) {
    this.table = table || new Map()
  }

  extend(name: string, value: Value): Env {
    return new Env(new Map([...this.table, [name, value]]))
  }

  lookup(name: string): undefined | Value {
    return this.table.get(name)
  }
}
