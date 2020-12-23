import { JoJo } from "../jos/jojo"

export type Triplex = {
  pre: JoJo
  post: JoJo
  jojo: JoJo
}

export type Mod = {
  table: Map<string, Triplex>
  extend: (name: string, triplex: Triplex) => Mod
  lookup: (name: string) => undefined | Triplex
}

export function Mod(table: Map<string, Triplex>): Mod {
  return {
    table,
    extend: (name, triplex) => Mod(new Map([...table, [name, triplex]])),
    lookup: (name) => table.get(name),
  }
}
