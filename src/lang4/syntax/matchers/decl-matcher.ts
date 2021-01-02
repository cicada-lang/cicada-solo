import * as pt from "../../../partech"
import { Decl } from "../../decl"
import { Define, Show } from "../../decls"
import { jo_matcher, jojo_matcher } from "./jo-matcher"

export function decls_matcher(tree: pt.Tree.Tree): Array<Decl> {
  return pt.Tree.matcher<Array<Decl>>({
    "decls:decls": ({ decls }) =>
      pt.matchers.zero_or_more_matcher(decls).map(decl_matcher),
  })(tree)
}

export function decl_matcher(tree: pt.Tree.Tree): Decl {
  return pt.Tree.matcher<Decl>({
    "decl:define": ({ claimed, pre, post, defined, jojo }) => {
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
        jojo_matcher(pre),
        jojo_matcher(post),
        jojo_matcher(jojo)
      )
    },
    "decl:show": ({ jojo }) => Show(jojo_matcher(jojo)),
  })(tree)
}
