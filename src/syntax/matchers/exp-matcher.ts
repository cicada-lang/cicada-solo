import * as Exp from "../../exp"
import * as pt from "../../partech"
import * as ut from "../../ut"
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

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>({
    "exp:var": ({ name }) => Var(pt.Tree.str(name)),
    "exp:pi": ({ name, arg_t, ret_t }) =>
      Pi(pt.Tree.str(name), exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:arrow": ({ arg_t, ret_t }) =>
      Pi("_", exp_matcher(arg_t), exp_matcher(ret_t)),
    "exp:fn": ({ name, ret }) => Fn(pt.Tree.str(name), exp_matcher(ret)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp.Exp = Var(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:sigma": ({ name, car_t, cdr_t }) =>
      Sigma(pt.Tree.str(name), exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:pair": ({ car_t, cdr_t }) =>
      Sigma("_", exp_matcher(car_t), exp_matcher(cdr_t)),
    "exp:cons": ({ car, cdr }) => Cons(exp_matcher(car), exp_matcher(cdr)),
    "exp:car": ({ target }) => Car(exp_matcher(target)),
    "exp:cdr": ({ target }) => Cdr(exp_matcher(target)),
    "exp:nat": () => new Nat(),
    "exp:zero": () => new Zero(),
    "exp:add1": ({ prev }) => new Add1(exp_matcher(prev)),
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
      NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "exp:equal": ({ t, from, to }) =>
      Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "exp:same": () => Same,
    "exp:replace": ({ target, motive, base }) =>
      Replace(exp_matcher(target), exp_matcher(motive), exp_matcher(base)),
    "exp:trivial": () => Trivial,
    "exp:sole": () => Sole,
    "exp:absurd": () => new Absurd(),
    "exp:absurd_ind": ({ target, motive }) =>
      new AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "exp:str": () => Str,
    "exp:quote": ({ value }) => new Quote(pt.trim_boundary(pt.Tree.str(value), 1)),
    "exp:type": () => Type,
    "exp:let": ({ name, exp, ret }) =>
      Let(pt.Tree.str(name), exp_matcher(exp), exp_matcher(ret)),
    "exp:the": ({ t, exp }) => The(exp_matcher(t), exp_matcher(exp)),
    "exp:deduction": ({ deduction_entries, deduction_args }) => {
      const entries = pt.matchers
        .one_or_more_matcher(deduction_entries)
        .map(deduction_entry_matcher)
      const args = pt.matchers
        .zero_or_more_matcher(deduction_args)
        .map(exp_matcher)
      return deduction_aux(entries, args)
    },
  })(tree)
}

function deduction_aux(
  entries: Array<{ t: Exp.Exp; exp: Exp.Exp }>,
  args: Array<Exp.Exp>
): Exp.Exp {
  if (entries.length === 0) {
    throw new Error("entries.length === 0")
  } else if (entries.length === 1) {
    let [{ t, exp }] = entries
    if (args.length === 0) return The(t, exp)
    for (const arg of args) exp = Ap(exp, arg)
    return The(t, exp)
  } else {
    const [{ t, exp }, ...rest] = entries
    const arg = deduction_aux(entries.slice(1), args)
    return The(t, Ap(exp, arg))
  }
}

export function deduction_entry_matcher(
  tree: pt.Tree.Tree
): { t: Exp.Exp; exp: Exp.Exp } {
  return pt.Tree.matcher<{ t: Exp.Exp; exp: Exp.Exp }>({
    "deduction_entry:deduction_entry": ({ t, exp }) => ({
      t: exp_matcher(t),
      exp: exp_matcher(exp),
    }),
  })(tree)
}
