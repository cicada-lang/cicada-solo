import * as Exp from "../exp"
import pt from "@forchange/partech"
import * as rr from "../../rr"

const identifier = pt.Sym.create_par_from_kind("identifier")

export function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    fn: ["(", identifier, ")", "=", ">", exp],
    ap: [identifier, pt.one_or_more(exp_in_paren)],
    suite: ["{", pt.zero_or_more(def), exp, "}"],
  })
}

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>("exp", {
    var: ([name]) => {
      return Exp.v(pt.Tree.token(name).value)
    },
    fn: ([, name, , , , ret]) => {
      return Exp.fn(pt.Tree.token(name).value, exp_matcher(ret))
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
    suite: ([, defs, ret]) => {
      return Exp.suite(
        pt.zero_or_more_matcher(def_matcher)(defs),
        exp_matcher(ret)
      )
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
