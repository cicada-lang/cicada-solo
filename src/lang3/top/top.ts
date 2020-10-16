import * as Exp from "../exp"

export type Top = def | type_constructor | show

interface def {
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

interface type_constructor {
  kind: "Top.type_constructor"
  type_constructor: Exp.type_constructor
}

export const type_constructor = (
  type_constructor: Exp.type_constructor
): type_constructor => ({
  kind: "Top.type_constructor",
  type_constructor,
})

interface show {
  kind: "Top.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Top.show",
  exp,
})
