import * as Exp from "../exp"
import * as Ty from "../ty"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

const preserved_identifiers = ["Zero", "Succ", "the", "rec"]

const identifier = new pt.Sym.Pat(
  /^identifier/,
  rr.seq(
    rr.negative_lookahead(rr.beginning, rr.or(...preserved_identifiers)),
    rr.word
  ),
  { name: "identifier" }
)

export function ty(): pt.Sym.Rule {
  return pt.Sym.create_rule("ty", {
    nat: ["Nat"],
    arrow: ["(", ty, ")", "-", ">", ty],
  })
}

export function ty_matcher(tree: pt.Tree.Tree): Ty.Ty {
  return pt.Tree.matcher<Ty.Ty>("ty", {
    nat: (_) => {
      return { kind: "Ty.Nat" }
    },
    arrow: ([, arg, , , , ret]) => {
      return {
        kind: "Ty.Arrow",
        arg_t: ty_matcher(arg),
        ret_t: ty_matcher(ret),
      }
    },
  })(tree)
}

export function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    fn: ["(", identifier, ")", "=", ">", exp],
    ap: [identifier, pt.one_or_more(exp_in_paren)],
    suite: ["{", pt.zero_or_more(def), exp, "}"],
    zero: ["Zero"],
    succ: ["Succ", "(", exp, ")"],
    rec: ["rec", "[", ty, "]", "(", exp, ",", exp, ",", exp, ")"],
    the: ["the", "[", ty, "]", "(", exp, ")"],
  })
}

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>("exp", {
    var: ([name]) => {
      return {
        kind: "Exp.Var",
        name: pt.Tree.token(name).value,
      }
    },
    fn: ([, name, , , , body]) => {
      return {
        kind: "Exp.Fn",
        name: pt.Tree.token(name).value,
        body: exp_matcher(body),
      }
    },
    ap: ([name, exp_in_paren_list]) => {
      let exp: Exp.Exp = {
        kind: "Exp.Var",
        name: pt.Tree.token(name).value,
      }
      const args = pt.one_or_more_matcher(exp_in_paren_matcher)(
        exp_in_paren_list
      )
      for (const arg of args) {
        exp = {
          kind: "Exp.Ap",
          rator: exp,
          rand: arg,
        }
      }
      return exp
    },
    suite: ([, defs, body]) => {
      return {
        kind: "Exp.Suite",
        defs: pt.zero_or_more_matcher(def_matcher)(defs),
        body: exp_matcher(body),
      }
    },
    zero: (_) => {
      return { kind: "Exp.Zero" }
    },
    succ: ([, , prev]) => {
      return { kind: "Exp.Succ", prev: exp_matcher(prev) }
    },
    rec: ([, , t, , , target, , base, , step]) => {
      return {
        kind: "Exp.Rec",
        t: ty_matcher(t),
        target: exp_matcher(target),
        base: exp_matcher(base),
        step: exp_matcher(step),
      }
    },
    the: ([, , t, , , exp]) => {
      return {
        kind: "Exp.The",
        t: ty_matcher(t),
        exp: exp_matcher(exp),
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
