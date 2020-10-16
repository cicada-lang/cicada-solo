import * as Exp from "../../exp"
import * as Value from "../../value"

export type Den = def | datatype

export interface def {
  kind: "Mod.Den.def"
  exp: Exp.Exp
  t?: Exp.Exp
  cached_value?: Value.Value
}

export const def = (
  exp: Exp.Exp,
  t?: Exp.Exp,
  cached_value?: Value.Value
): def => ({
  kind: "Mod.Den.def",
  exp,
  t,
  cached_value,
})

export interface datatype {
  kind: "Mod.Den.datatype"
  datatype: Exp.type_constructor
}

export const datatype = (datatype: Exp.type_constructor): datatype => ({
  kind: "Mod.Den.datatype",
  datatype,
})
