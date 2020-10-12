import * as Exp from "../exp"

export type Stmt = def

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
