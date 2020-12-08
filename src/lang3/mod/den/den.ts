import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Mod from "../../mod"
import * as Modpath from "../../modpath"

export type Den = mod | def | typecons

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

export type typecons = {
  kind: "Mod.Den.typecons"
  typecons: Exp.typecons
}

export const typecons = (
  typecons: Exp.typecons
): typecons => ({
  kind: "Mod.Den.typecons",
  typecons,
})
