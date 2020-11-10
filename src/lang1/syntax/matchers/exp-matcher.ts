import * as Exp from "../../exp"
import * as Ty from "../../ty"
import * as pt from "../../../partech"
import * as ut from "../../../ut"
import { stmts_matcher, ty_matcher } from "../matchers"

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
    "exp:begin": ({ stmts, ret }) =>
      Exp.begin(stmts_matcher(stmts), exp_matcher(ret)),
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
  entries: Array<{ t: Ty.Ty; exp: Exp.Exp }>,
  args: Array<Exp.Exp>
): Exp.Exp {
  if (entries.length === 0) {
    throw new Error("entries.length === 0")
  } else if (entries.length === 1) {
    let [{ t, exp }] = entries
    if (args.length === 0) return Exp.the(t, exp)
    for (const arg of args) exp = Exp.ap(exp, arg)
    return Exp.the(t, exp)
  } else {
    const [{ t, exp }, ...rest] = entries
    const arg = deduction_aux(entries.slice(1), args)
    return Exp.the(t, Exp.ap(exp, arg))
  }
}

export function deduction_entry_matcher(
  tree: pt.Tree.Tree
): { t: Ty.Ty; exp: Exp.Exp } {
  return pt.Tree.matcher<{ t: Ty.Ty; exp: Exp.Exp }>({
    "deduction_entry:deduction_entry": ({ t, exp }) => ({
      t: ty_matcher(t),
      exp: exp_matcher(exp),
    }),
  })(tree)
}
