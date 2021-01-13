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
    "stmt:define": ({ claimed, pre, post, defined, jojo }) => {
      const claimed_name = pt.Tree.str(claimed)
      const defined_name = pt.Tree.str(defined)
      if (claimed_name !== defined_name) {
        throw new Error(
          `Mismatching names, claimed: ${claimed_name}, defined: ${defined_name}\n`
        )
      }
      const name = claimed_name
      return Define(
        name,
        JoJo(jos_matcher(pre)),
        JoJo(jos_matcher(post)),
        jojo_matcher(jojo)
      )
    },
    "stmt:show": ({ jojo }) => Show(jojo_matcher(jojo)),
  })(tree)
}
