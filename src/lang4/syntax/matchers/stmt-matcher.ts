import * as pt from "../../../partech"
import { Stmt } from "../../stmt"
import { jo_matcher } from "./jo-matcher"

export function stmts_matcher(tree: pt.Tree.Tree): Array<Stmt> {
  return pt.Tree.matcher<Array<Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree.Tree): Stmt {
  return pt.Tree.matcher<Stmt>({
    "stmt:define": ({ claimed_name, pre, post, defined_name, jojo }) => {
      throw new Error()
    },
    "stmt:show": ({ jojo }) => {
      throw new Error()
    },
  })(tree)
}
