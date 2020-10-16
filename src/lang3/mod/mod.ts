import * as Den from "./den"
import * as Exp from "../exp"
import * as Value from "../value"

export interface Entry {
  den: Den.Den
  cached_value?: Value.Value
}

export interface Mod {
  map: Map<string, Entry>
}
