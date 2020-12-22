import * as pt from "../../../partech"
import * as Exp from "../../exp"
import { Var, Fn, Ap, Begin } from "../../exps"
import { stmts_matcher } from "../matchers"

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Var(pt.Tree.str(name)),
    "exp:fn": ({ name, body }) => Fn(pt.Tree.str(name), exp_matcher(body)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp.Exp = Var(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:begin": ({ stmts, ret }) =>
      Begin(stmts_matcher(stmts), exp_matcher(ret)),
  })(tree)
}
