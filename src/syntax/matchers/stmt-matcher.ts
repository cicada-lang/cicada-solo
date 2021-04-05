import pt from "@cicada-lang/partech"
import { Stmt } from "@/stmt"
import { Def, Class, Show } from "@/stmts"
import { exp_matcher, cls_matcher } from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher<Array<Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:def": ({ name, exp }) => new Def(pt.str(name), exp_matcher(exp)),
    "stmt:class": ({ name, cls }) => new Class(pt.str(name), cls_matcher(cls)),
    "stmt:show": ({ exp }) => new Show(exp_matcher(exp)),
  })(tree)
}
