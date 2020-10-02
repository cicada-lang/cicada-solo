import * as Exp from "../exp"
import * as Ty from "../ty"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
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
    "exp:zero": () => Exp.zero,
    "exp:add1": ({ prev }) => Exp.add1(exp_matcher(prev)),
    "exp:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.Tree.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return Exp.nat_from_number(n)
      }
    },
    "exp:rec": ({ t, target, base, step }) =>
      Exp.rec(
        ty_matcher(t),
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:the": ({ exp, t }) => Exp.the(ty_matcher(t), exp_matcher(exp)),
  })(tree)
}

function ty_matcher(tree: pt.Tree.Tree): Ty.Ty {
  return pt.Tree.matcher<Ty.Ty>({
    "ty:nat": () => Ty.nat,
    "ty:arrow": ({ arg_t, ret_t }) =>
      Ty.arrow(ty_matcher(arg_t), ty_matcher(ret_t)),
  })(tree)
}

function def_matcher(tree: pt.Tree.Tree): { name: string; exp: Exp.Exp } {
  return pt.Tree.matcher<{ name: string; exp: Exp.Exp }>({
    "def:def": ({ name, exp }) => ({
      name: pt.Tree.str(name),
      exp: exp_matcher(exp),
    }),
  })(tree)
}
