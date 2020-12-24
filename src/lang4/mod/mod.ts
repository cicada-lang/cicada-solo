import { World } from "../world"
import { JoJo } from "../jos/jojo"
import { Value } from "../value"
import { Env } from "../env"
import { JoJoComposeValue } from "../values/jojo-compose-value"

export type Triplex = {
  pre: JoJo
  post: JoJo
  jojo: JoJo
}

export type Mod = {
  table: Map<string, Triplex>
  extend: (name: string, triplex: Triplex) => Mod
  lookup_triplex: (name: string) => undefined | Triplex
  lookup_value: (name: string) => undefined | Value
}

export function Mod(table: Map<string, Triplex>): Mod {
  return {
    table,
    extend: (name, triplex) => Mod(new Map([...table, [name, triplex]])),
    lookup_triplex: (name) => table.get(name),
    lookup_value(name) {
      const triplex = table.get(name)
      if (triplex === undefined) return undefined
      return new JoJoComposeValue(triplex.jojo.array, {
        env: Env(new Map()),
        mod: Mod(table),
      })
    },
  }
}
