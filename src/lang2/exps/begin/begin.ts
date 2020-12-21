import { Exp } from "../../exp"
import { Stmt } from "../../stmt"

export type Begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt>
  ret: Exp
}

export function Begin(stmts: Array<Stmt>, ret: Exp): Begin {
  return {
    kind: "Exp.begin",
    stmts,
    ret,
  }
}
