import { Value } from "../value"

export type Env = {
  table: Map<string, Value>
  extend: (name: string, value: Value) => Env
  lookup: (name: string) => undefined | Value
}

export function Env(table: Map<string, Value>): Env {
  return {
    table,
    extend: (name, value) => Env(new Map([...table, [name, value]])),
    lookup: (name) => table.get(name),
  }
}
