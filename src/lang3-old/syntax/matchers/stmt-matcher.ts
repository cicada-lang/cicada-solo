import * as Exp from "../../exp"
import * as Stmt from "../../stmt"
import * as pt from "../../../partech"
import { exp_matcher } from "../matchers"

export function stmts_matcher(tree: pt.Tree.Tree): Array<Stmt.Stmt> {
  return pt.Tree.matcher<Array<Stmt.Stmt>>({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree.Tree): Stmt.Stmt {
  return pt.Tree.matcher<Stmt.Stmt>({
    "stmt:def": ({ name, exp }) =>
      Stmt.def(pt.Tree.str(name), exp_matcher(exp)),
    "stmt:claim": ({ claim, t, define, exp }, { span }) => {
      if (pt.Tree.str(claim) !== pt.Tree.str(define)) {
        throw new pt.ParsingError(
          "Name mismatch.\n" +
            `- name to claim  : ${pt.Tree.str(claim)}\n` +
            `- name to define : ${pt.Tree.str(define)}\n`,
          { span }
        )
      }
      return Stmt.def(
        pt.Tree.str(claim),
        Exp.the(exp_matcher(t), exp_matcher(exp))
      )
    },
  })(tree)
}
