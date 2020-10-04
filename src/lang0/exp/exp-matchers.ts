import * as Exp from "../exp"
import * as pt from "../../partech"

function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Exp.v(pt.Tree.str(name)),
    "exp:fn": ({ name, body }) => Exp.fn(pt.Tree.str(name), exp_matcher(body)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp.Exp = Exp.v(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Exp.ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:suite": ({ defs, ret }) =>
      Exp.suite(
        pt.matchers.zero_or_more_matcher(defs).map(def_matcher),
        exp_matcher(ret)
      ),
  })(tree)
}

function def_matcher(tree: pt.Tree.Tree): { name: string; exp: Exp.Exp } {
  return pt.Tree.matcher<{ name: string; exp: Exp.Exp }>({
    "def:def": ({ name, exp }) => {
      return {
        name: pt.Tree.str(name),
        exp: exp_matcher(exp),
      }
    },
  })(tree)
}

export const matchers = { exp_matcher }
