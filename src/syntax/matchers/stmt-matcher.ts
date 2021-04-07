import pt from "@cicada-lang/partech"
import { Stmt } from "@/stmt"
import { Def, Class, Show } from "@/stmts"
import { Cls } from "@/core"
import { exp_matcher, cls_entry_matcher } from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher<Array<Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:def": ({ name, exp }) => new Def(pt.str(name), exp_matcher(exp)),
    "stmt:class": ({ name, entries }) =>
      new Class(
        pt.str(name),
        new Cls(
          pt.matchers.zero_or_more_matcher(entries).map(cls_entry_matcher)
        )
      ),
    "stmt:show": ({ exp }) => new Show(exp_matcher(exp)),
  })(tree)
}
