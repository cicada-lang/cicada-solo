import * as Exp from "../exp"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

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
      return {
        kind: "Exp.v",
        name: pt.Tree.token(name).value,
      }
    },
    fn: ([, name, , , , body]) => {
      return {
        kind: "Exp.fn",
        name: pt.Tree.token(name).value,
        body: exp_matcher(body),
      }
    },
    ap: ([name, exp_in_paren_list]) => {
      let exp: Exp.Exp = {
        kind: "Exp.v",
        name: pt.Tree.token(name).value,
      }
      const args = pt.one_or_more_matcher(exp_in_paren_matcher)(
        exp_in_paren_list
      )
      for (const arg of args) {
        exp = {
          kind: "Exp.ap",
          target: exp,
          arg: arg,
        }
      }
      return exp
    },
    suite: ([, defs, body]) => {
      return {
        kind: "Exp.suite",
        defs: pt.zero_or_more_matcher(def_matcher)(defs),
        body: exp_matcher(body),
      }
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
