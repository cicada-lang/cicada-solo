import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Modpath from "../../modpath"

export type Den = mod | def | type_constructor

export type mod = {
  kind: "Mod.Den.mod"
  modpath: Modpath.Modpath
}

export const mod = (modpath: Modpath.Modpath): mod => ({
  kind: "Mod.Den.mod",
  modpath,
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
