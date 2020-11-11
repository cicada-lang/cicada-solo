import * as Exp from "../exp"

export type Stmt = def | show

type def = {
  kind: "Stmt.def"
  name: string
  exp: Exp.Exp
}

export const def = (name: string, exp: Exp.Exp): def => ({
  kind: "Stmt.def",
  name,
  exp,
})

type show = {
  kind: "Stmt.show"
  exp: Exp.Exp
}

export const show = (exp: Exp.Exp): show => ({
  kind: "Stmt.show",
  exp,
})
