import * as Exp from "../exp"
import * as Value from "../value"

export interface Entry {
  t?: Exp.Exp
  exp: Exp.Exp
  value_cache?: Value.Value
}

export interface Mod {
  map: Map<string, Entry>
}
