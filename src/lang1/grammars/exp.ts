import * as Exp from "../exp"
import * as Ty from "../ty"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

const preserved_identifiers = ["zero", "add1", "rec"]

const identifier = new pt.Sym.Pat(
  /^identifier/,
  rr.seq(
    rr.negative_lookahead(rr.beginning, rr.or(...preserved_identifiers)),
    rr.word
  ),
  { name: "identifier" }
)

const num = pt.Sym.create_par_from_kind("number", { name: "number" })

function num_matcher(tree: pt.Tree.Tree): number {
  const s = pt.Tree.token(tree).value
  return Number.parseInt(s)
}

export function ty(): pt.Sym.Rule {
  return pt.Sym.create_rule("ty", {
    nat: ["Nat"],
    arrow: ["(", ty, ")", "-", ">", ty],
  })
}

export function ty_matcher(tree: pt.Tree.Tree): Ty.Ty {
  return pt.Tree.matcher<Ty.Ty>("ty", {
    nat: (_) => {
      return Ty.nat
    },
    arrow: ([, arg, , , , ret]) => {
      return Ty.arrow(ty_matcher(arg), ty_matcher(ret))
    },
  })(tree)
}

export function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    fn: ["(", identifier, ")", "=", ">", exp],
    ap: [identifier, pt.one_or_more(exp_in_paren)],
    suite: ["{", pt.zero_or_more(def), exp, "}"],
    zero: ["zero"],
    add1: ["add1", "(", exp, ")"],
    number: [num],
    rec: ["rec", "[", ty, "]", "(", exp, ",", exp, ",", exp, ")"],
    the: [exp, ":", ty],
  })
}

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>("exp", {
    var: ([name]) => {
      return Exp.v(pt.Tree.token(name).value)
    },
    fn: ([, name, , , , body]) => {
      return Exp.fn(pt.Tree.token(name).value, exp_matcher(body))
    },
    ap: ([name, exp_in_paren_list]) => {
      let exp: Exp.Exp = Exp.v(pt.Tree.token(name).value)
      const args = pt.one_or_more_matcher(exp_in_paren_matcher)(
        exp_in_paren_list
      )
      for (const arg of args) {
        exp = Exp.ap(exp, arg)
      }
      return exp
    },
    suite: ([, defs, body]) => {
      return Exp.suite(
        pt.zero_or_more_matcher(def_matcher)(defs),
        exp_matcher(body)
      )
    },
    zero: (_) => {
      return Exp.zero
    },
    add1: ([, , prev]) => {
      return Exp.add1(exp_matcher(prev))
    },
    number: ([num]) => {
      const n = num_matcher(num)
      return Exp.nat_from_number(n)
    },
    rec: ([, , t, , , target, , base, , step]) => {
      return Exp.rec(
        ty_matcher(t),
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      )
    },
    the: ([exp, , t]) => {
      return Exp.the(ty_matcher(t), exp_matcher(exp))
    },
  })(tree)
}

function exp_in_paren(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp_in_paren", {
    exp_in_paren: ["(", exp, ")"],
  })
}

export function exp_in_paren_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>("exp_in_paren", {
    exp_in_paren: ([, exp]) => exp_matcher(exp),
  })(tree)
}

function def(): pt.Sym.Rule {
  return pt.Sym.create_rule("def", {
    def: [identifier, "=", exp],
  })
}

export function def_matcher(
  tree: pt.Tree.Tree
): { name: string; exp: Exp.Exp } {
  return pt.Tree.matcher("def", {
    def: ([name, , exp]) => {
      return {
        name: pt.Tree.token(name).value,
        exp: exp_matcher(exp),
      }
    },
  })(tree)
}
