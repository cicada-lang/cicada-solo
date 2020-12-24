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

export class Mod {
  table: Map<string, Triplex>

  constructor(table?: Map<string, Triplex>) {
    this.table = table || new Map()
  }

  extend(name: string, triplex: Triplex): Mod {
    return new Mod(new Map([...this.table, [name, triplex]]))
  }

  lookup_triplex(name: string): undefined | Triplex {
    return this.table.get(name)
  }

  lookup_value(name: string): undefined | Value {
    const triplex = this.table.get(name)
    if (triplex === undefined) return undefined
    return new JoJoComposeValue(triplex.jojo.array, {
      env: new Env(),
      mod: this,
    })
  }
}
