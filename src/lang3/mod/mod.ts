import * as Den from "./den"
import * as Exp from "../exp"
import * as Value from "../value"

export type Entry = {
  den: Den.Den
  cached_value?: Value.Value
}

export type Mod = {
  map: Map<string, Entry>
}
