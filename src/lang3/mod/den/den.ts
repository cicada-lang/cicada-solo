import * as Exp from "../../exp"
import * as Value from "../../value"

export type Den = def | type_constructor

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

export interface type_constructor {
  kind: "Mod.Den.type_constructor"
  type_constructor: Exp.type_constructor
}

export const type_constructor = (
  type_constructor: Exp.type_constructor
): type_constructor => ({
  kind: "Mod.Den.type_constructor",
  type_constructor,
})
