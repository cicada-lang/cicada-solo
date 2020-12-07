import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Mod from "../../mod"
import * as Modpath from "../../modpath"

export type Den = mod | def | type_constructor

export type mod = {
  kind: "Mod.Den.mod"
  modpath: Modpath.Modpath
  mod: Mod.Mod
}

export const mod = (modpath: Modpath.Modpath, mod: Mod.Mod): mod => ({
  kind: "Mod.Den.mod",
  modpath,
  mod,
})

export type def = {
  kind: "Mod.Den.def"
  exp: Exp.Exp
  t?: Exp.Exp
}

export const def = (exp: Exp.Exp, t?: Exp.Exp): def => ({
  kind: "Mod.Den.def",
  exp,
  t,
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
