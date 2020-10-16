import * as Exp from "../exp"

export type Top = def | datatype | show

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

interface datatype {
  kind: "Top.datatype"
  datatype: Exp.type_constructor
}

export const datatype = (datatype: Exp.type_constructor): datatype => ({
  kind: "Top.datatype",
  datatype,
})

interface show {
  kind: "Top.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Top.show",
  exp,
})
