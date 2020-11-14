import * as Exp from "../exp"

export type Top = $import | def | type_constructor | show

type $import = {
  kind: "Top.import"
  modpath: string
}

export const $import = (modpath: string): $import => ({
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

type type_constructor = {
  kind: "Top.type_constructor"
  type_constructor: Exp.type_constructor
}

export const type_constructor = (
  type_constructor: Exp.type_constructor
): type_constructor => ({
  kind: "Top.type_constructor",
  type_constructor,
})

type show = {
  kind: "Top.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Top.show",
  exp,
})
