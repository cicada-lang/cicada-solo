import * as Exp from "../../exp"
import * as Top from "../../top"
import * as pt from "../../../partech"
import { exp_matcher } from "../matchers"

export function sums_matcher(
  tree: pt.Tree.Tree
): Array<{ tag: string; t: Exp.Exp }> {
  return pt.Tree.matcher<Array<{ tag: string; t: Exp.Exp }>>({
    "sums:sums": ({ sums }) =>
      pt.matchers.zero_or_more_matcher(sums).map(sum_entry_matcher),
  })(tree)
}

export function sum_entry_matcher(
  tree: pt.Tree.Tree
): { tag: string; t: Exp.Exp } {
  return pt.Tree.matcher<{ tag: string; t: Exp.Exp }>({
    "sum_entry:sum_entry": ({ tag, t }) => ({
      tag: pt.Tree.str(tag),
      t: exp_matcher(t),
    }),
  })(tree)
}
