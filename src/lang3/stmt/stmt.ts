import * as Exp from "../exp"

export type Stmt = def

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
