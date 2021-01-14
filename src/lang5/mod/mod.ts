import { World } from "../world"
import { JoJo } from "../jos/jojo"
import { Value } from "../value"
import { Env } from "../env"
import { JoJoComposeValue } from "../values"

export type Mod = {
  table: Map<string, JoJo>
  extend: (name: string, jojo: JoJo) => Mod
  lookup_jojo: (name: string) => undefined | JoJo
  lookup_value: (name: string) => undefined | Value
}

export function Mod(table: Map<string, JoJo>): Mod {
  return {
    table,
    extend: (name, jojo) => Mod(new Map([...table, [name, jojo]])),
    lookup_jojo: (name) => table.get(name),
    lookup_value(name) {
      const jojo = table.get(name)
      if (jojo === undefined) return undefined
      return JoJoComposeValue(jojo, {
        env: Env(new Map()),
        mod: Mod(table),
      })
    },
  }
}
