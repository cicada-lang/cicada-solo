import pt from "@cicada-lang/partech"
import * as ut from "../../ut"
import { Exp, nat_from_number } from "../../exp"
import { stmts_matcher } from "../matchers"
import { Var } from "../../exps"
import { Pi, Fn, Ap } from "../../exps"
import { Sigma, Cons, Car, Cdr } from "../../exps"
import { Nat, Zero, Add1, NatInd } from "../../exps"
import { Equal, Same, Replace } from "../../exps"
import { Absurd, AbsurdInd } from "../../exps"
import { Trivial, Sole } from "../../exps"
import { Str, Quote } from "../../exps"
import { Type } from "../../exps"
import { Let } from "../../exps"
import { The } from "../../exps"

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:var": ({ name }) => new Var(pt.str(name)),
    "exp:pi": ({ name, arg_t, ret_t }) =>
      new Pi(pt.str(name), exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:arrow": ({ arg_t, ret_t }) =>
      new Pi("_", exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:fn": ({ name, ret }) => new Fn(pt.str(name), exp_matcher(ret)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp = new Var(pt.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = new Ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:sigma": ({ name, car_t, cdr_t }) =>
      new Sigma(pt.str(name), exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:pair": ({ car_t, cdr_t }) =>
      new Sigma("_", exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:cons": ({ car, cdr }) => new Cons(exp_matcher(car), exp_matcher(cdr)),
    "exp:car": ({ target }) => new Car(exp_matcher(target)),
    "exp:cdr": ({ target }) => new Cdr(exp_matcher(target)),
    "exp:nat": () => new Nat(),
    "exp:zero": () => new Zero(),
    "exp:add1": ({ prev }) => new Add1(exp_matcher(prev)),
    "exp:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "exp:nat_ind": ({ target, motive, base, step }) =>
      new NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:equal": ({ t, from, to }) =>
      new Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => new Same(),
    "exp:replace": ({ target, motive, base }) =>
      new Replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base)),
    "exp:trivial": () => new Trivial(),
    "exp:sole": () => new Sole(),
    "exp:absurd": () => new Absurd(),
    "exp:absurd_ind": ({ target, motive }) =>
      new AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => new Str(),
    "exp:quote": ({ value }) => new Quote(pt.trim_boundary(pt.str(value), 1)),
    "exp:type": () => new Type(),
    "exp:let": ({ name, exp, ret }) =>
      new Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "exp:the": ({ t, exp }) => new The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}
