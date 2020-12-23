import { JoJo } from "../jos/jojo"

export type Mod = {
  table: Map<string, JoJo>
  extend: (name: string, jojo: JoJo) => Mod
  lookup: (name: string) => undefined | JoJo
}

export function Mod(table: Map<string, JoJo>): Mod {
  return {
    table,
    extend: (name, jojo) => Mod(new Map([...table, [name, jojo]])),
    lookup: (name) => table.get(name),
  }
}
