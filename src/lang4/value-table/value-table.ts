import { Value } from "../value"

export type ValueTable = {
  table: Map<string, Value>
  define: (name: string, value: Value) => ValueTable
  lookup: (name: string) => undefined | Value
}

export function ValueTable(table: Map<string, Value>): ValueTable {
  return {
    table,
    define: (name, value) => ValueTable(new Map([...table, [name, value]])),
    lookup: (name) => table.get(name),
  }
}
