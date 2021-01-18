import * as pt from "../../../partech"
import { Stmt } from "../../stmt"
import { Define, Show } from "../../stmts"
import { exp_matcher } from "../matchers"

export function stmt_matcher(tree: pt.Tree.Tree): Stmt {
  return pt.Tree.matcher<Stmt>({
    "stmt:def": ({ name, exp }) => Define(pt.Tree.str(name), exp_matcher(exp)),
    "stmt:show": ({ exp }) => Show(exp_matcher(exp)),
  })(tree)
}

export function stmts_matcher(tree: pt.Tree.Tree): Array<Stmt> {
  return pt.Tree.matcher<Array<Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}
