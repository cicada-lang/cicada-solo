import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  return exp.repr()
}
