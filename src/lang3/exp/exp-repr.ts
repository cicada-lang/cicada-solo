import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Pattern from "../pattern"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  return exp.repr()
}
