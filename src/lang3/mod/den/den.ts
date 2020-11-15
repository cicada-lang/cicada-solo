import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Mod from "../../mod"

export type Den = mod | def | type_constructor

export type mod = {
  kind: "Mod.Den.mod"
  mod: Mod.Mod
}

export const mod = (mod: Mod.Mod): mod => ({
  kind: "Mod.Den.mod",
  mod,
})

export type def = {
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

export type type_constructor = {
  kind: "Mod.Den.type_constructor"
  type_constructor: Exp.type_constructor
}

export const type_constructor = (
  type_constructor: Exp.type_constructor
): type_constructor => ({
  kind: "Mod.Den.type_constructor",
  type_constructor,
})
