import * as Exp from "../../exp"
import * as Value from "../../value"

export type Den = def | datatype

export interface def {
  kind: "Den.def"
  t?: Exp.Exp
  exp: Exp.Exp
  value_cache?: Value.Value
}

export interface datatype {
  kind: "Den.datatype"
  datatype: Exp.datatype
}
