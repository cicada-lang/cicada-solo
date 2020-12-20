import { Exp } from "../../exp"
import { Var, Fn, Ap, Add1, Zero, The, Begin, Rec } from "../../exps"
import { Ty } from "../../ty"
import * as pt from "../../../partech"
import * as ut from "../../../ut"
import { stmts_matcher, ty_matcher } from "../matchers"
import { nat_from_number } from "../../nat-util"

export function exp_matcher(tree: pt.Tree.Tree): Exp {
  return pt.Tree.matcher<Exp>({
    "exp:var": ({ name }) => Var(pt.Tree.str(name)),
    "exp:fn": ({ name, body }) => Fn(pt.Tree.str(name), exp_matcher(body)),
    "exp:ap": ({ target, args }) => {
      let exp: Exp = Var(pt.Tree.str(target))
      for (const arg of pt.matchers.one_or_more_matcher(args)) {
        exp = Ap(exp, exp_matcher(arg))
      }
      return exp
    },
    "exp:begin": ({ stmts, ret }) =>
      Begin(stmts_matcher(stmts), exp_matcher(ret)),
    "exp:zero": () => Zero,
    "exp:add1": ({ prev }) => Add1(exp_matcher(prev)),
    "exp:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.Tree.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "exp:rec": ({ t, target, base, step }) =>
      Rec(
        ty_matcher(t),
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
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
  entries: Array<{ t: Ty; exp: Exp }>,
  args: Array<Exp>
): Exp {
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
): { t: Ty; exp: Exp } {
  return pt.Tree.matcher<{ t: Ty; exp: Exp }>({
    "deduction_entry:deduction_entry": ({ t, exp }) => ({
      t: ty_matcher(t),
      exp: exp_matcher(exp),
    }),
  })(tree)
}
