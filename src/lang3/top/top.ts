import * as Exp from "../exp"

export type Top = def | show

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

interface show {
  kind: "Top.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Top.show",
  exp,
})
