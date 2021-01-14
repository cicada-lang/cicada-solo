import * as pt from "../../../partech"
import { Stmt } from "../../stmt"
import { Define, Show } from "../../stmts"
import { JoJo } from "../../jos"
import { jo_matcher, jos_matcher, jojo_matcher } from "./jo-matcher"

export function stmts_matcher(tree: pt.Tree.Tree): Array<Stmt> {
  return pt.Tree.matcher<Array<Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree.Tree): Stmt {
  return pt.Tree.matcher<Stmt>({
    "stmt:define": ({ defined, jojo }) =>
      Define(pt.Tree.str(defined), jojo_matcher(jojo)),
    "stmt:show": ({ jojo }) => Show(jojo_matcher(jojo)),
  })(tree)
}
