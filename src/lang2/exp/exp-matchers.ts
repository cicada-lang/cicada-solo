import * as Exp from "../exp"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Exp.v(pt.Tree.str(name)),
    "exp:pi": ({ name, arg_t, ret_t }) =>
      Exp.pi(pt.Tree.str(name), exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:arrow": ({ arg_t, ret_t }) =>
      Exp.pi("_", exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:fn": ({ name, body }) => Exp.fn(pt.Tree.str(name), exp_matcher(body)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp.Exp = Exp.v(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Exp.ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:sigma": ({ name, car_t, cdr_t }) =>
      Exp.sigma(pt.Tree.str(name), exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:pair": ({ car_t, cdr_t }) =>
      Exp.sigma("_", exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:cons": ({ car, cdr }) => Exp.cons(exp_matcher(car), exp_matcher(cdr)),
    "exp:car": ({ target }) => Exp.car(exp_matcher(target)),
    "exp:cdr": ({ target }) => Exp.cdr(exp_matcher(target)),
    "exp:nat": () => Exp.nat,
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
    "exp:nat_ind": ({ target, motive, base, step }) =>
      Exp.nat_ind(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:equal": ({ t, from, to }) =>
      Exp.equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => Exp.same,
    "exp:replace": ({ target, motive, base }) =>
      Exp.replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base)),
    "exp:trivial": () => Exp.trivial,
    "exp:sole": () => Exp.sole,
    "exp:absurd": () => Exp.absurd,
    "exp:absurd_ind": ({ target, motive }) =>
      Exp.absurd_ind(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => Exp.str,
    "exp:quote": ({ value }) => {
      const str = pt.Tree.str(value)
      return Exp.quote(str.slice(1, str.length))
    },
    "exp:type": () => Exp.type,
    "exp:suite": ({ defs, ret }) =>
      Exp.suite(
        pt.matchers.zero_or_more_matcher(defs).map(def_matcher),
        exp_matcher(ret)
      ),
    "exp:the": ({ exp, t }) => Exp.the(exp_matcher(t), exp_matcher(exp)),
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

export const matchers = { exp_matcher }
