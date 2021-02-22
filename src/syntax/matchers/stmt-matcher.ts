import * as Exp from "../../exp"
import * as Stmt from "../../stmt"
import * as pt from "../../partech"
import { exp_matcher } from "../matchers"
import { The } from "../../exps"

export function stmts_matcher(tree: pt.Tree): Array<Stmt.Stmt> {
  return pt.matcher<Array<Stmt.Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt.Stmt {
  return pt.matcher<Stmt.Stmt>({
    "stmt:def": ({ name, exp }) => Stmt.def(pt.str(name), exp_matcher(exp)),
    "stmt:show": ({ exp }) => Stmt.show(exp_matcher(exp)),
  })(tree)
}
