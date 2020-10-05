import * as Exp from "../exp"
import * as Stmt from "../stmt"
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
    "exp:suite": ({ stmts, ret }) =>
      Exp.suite(stmts_matcher(stmts), exp_matcher(ret)),
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

export function ty_matcher(tree: pt.Tree.Tree): Ty.Ty {
  return pt.Tree.matcher<Ty.Ty>({
    "ty:nat": () => Ty.nat,
    "ty:arrow": ({ arg_t, ret_t }) =>
      Ty.arrow(ty_matcher(arg_t), ty_matcher(ret_t)),
  })(tree)
}

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

      const name = claim
      return Stmt.def(
        pt.Tree.str(name),
        Exp.the(ty_matcher(t), exp_matcher(exp))
      )
    },
    "stmt:show": ({ exp }) => Stmt.show(exp_matcher(exp)),
  })(tree)
}
