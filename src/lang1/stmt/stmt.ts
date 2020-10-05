import * as Exp from "../exp"

export type Stmt = def | show

interface def {
  kind: "Stmt.def"
  name: string
  exp: Exp.Exp
}

export const def = (name: string, exp: Exp.Exp): def => ({
  kind: "Stmt.def",
  name,
  exp,
})

interface show {
  kind: "Stmt.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Stmt.show",
  exp,
})
