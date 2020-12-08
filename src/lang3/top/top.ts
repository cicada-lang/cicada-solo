import * as Exp from "../exp"
import * as Modpath from "../modpath"

export type Top = $import | def | typecons | show

type $import = {
  kind: "Top.import"
  modpath: Modpath.Modpath
}

export const $import = (modpath: Modpath.Modpath): $import => ({
  kind: "Top.import",
  modpath,
})

type def = {
  kind: "Top.def"
  name: string
  t?: Exp.Exp
  exp: Exp.Exp
}

export const def = (
  name: string,
  t: undefined | Exp.Exp,
  exp: Exp.Exp
): def => ({
  kind: "Top.def",
  name,
  t,
  exp,
})

type typecons = {
  kind: "Top.typecons"
  typecons: Exp.typecons
}

export const typecons = (typecons: Exp.typecons): typecons => ({
  kind: "Top.typecons",
  typecons,
})

type show = {
  kind: "Top.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Top.show",
  exp,
})
