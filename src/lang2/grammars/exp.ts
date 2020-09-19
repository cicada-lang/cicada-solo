import * as Exp from "../exp"
import pt from "@forchange/partech"
import * as rr from "../../rr"

const preserved_identifiers = [
  "Pair",
  "cons",
  "car",
  "cdr",
  "Nat",
  "zero",
  "add1",
  "Equal",
  "same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "String",
  "Type",
]

const identifier = new pt.Sym.Pat(
  /^identifier/,
  rr.seq(
    rr.negative_lookahead(rr.beginning, rr.or(...preserved_identifiers)),
    rr.word
  ),
  { name: "identifier" }
)

const str = pt.Sym.create_par_from_kind("string", { name: "string" })

function str_matcher(tree: pt.Tree.Tree): string {
  const s = pt.Tree.token(tree).value
  return s.slice(1, s.length - 1)
}

const num = pt.Sym.create_par_from_kind("number", { name: "number" })

function num_matcher(tree: pt.Tree.Tree): number {
  const s = pt.Tree.token(tree).value
  return Number.parseInt(s)
}

function type_assignment(): pt.Sym.Rule {
  return pt.Sym.create_rule("type_assignment", {
    named: [identifier, ":", exp],
    unnamed: [exp],
  })
}

function type_assignment_matcher(
  tree: pt.Tree.Tree
): { name: string; t: Exp.Exp } {
  return pt.Tree.matcher("type_assignment", {
    named: ([name, , t]) => {
      return {
        name: pt.Tree.token(name).value,
        t: exp_matcher(t),
      }
    },
    unnamed: ([t]) => {
      return {
        name: "_",
        t: exp_matcher(t),
      }
    },
  })(tree)
}

export function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    pi: ["(", type_assignment, ")", "-", ">", exp],
    fn: ["(", identifier, ")", "=", ">", exp],
    ap: [
      identifier,
      pt.one_or_more(in_between("(", comma_separated(exp), ")")),
    ],
    sigma: ["(", identifier, ":", exp, ")", "*", exp],
    pair: ["Pair", "(", exp, ",", exp, ")"],
    cons: ["cons", "(", exp, ",", exp, ")"],
    car: ["car", "(", exp, ")"],
    cdr: ["cdr", "(", exp, ")"],
    nat: ["Nat"],
    zero: ["zero"],
    add1: ["add1", "(", exp, ")"],
    number: [num],
    nat_ind: ["Nat", ".", "ind", "(", exp, ",", exp, ",", exp, ",", exp, ")"],
    equal: ["Equal", "(", exp, ",", exp, ",", exp, ")"],
    same: ["same"],
    replace: ["replace", "(", exp, ",", exp, ",", exp, ")"],
    trivial: ["Trivial"],
    sole: ["sole"],
    absurd: ["Absurd"],
    absurd_ind: ["Absurd", ".", "ind", "(", exp, ",", exp, ")"],
    str: ["String"],
    quote: [str],
    type: ["Type"],
    suite: ["{", pt.zero_or_more(def), exp, "}"],
    the: [exp, ":", exp],
  })
}

export function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher<Exp.Exp>("exp", {
    var: ([name]) => {
      return Exp.v(pt.Tree.token(name).value)
    },
    pi: ([, type_assignment, , , , ret_t]) => {
      const { name, t } = type_assignment_matcher(type_assignment)
      return Exp.pi(name, t, exp_matcher(ret_t))
    },
    fn: ([, name, , , , ret]) => {
      return Exp.fn(pt.Tree.token(name).value, exp_matcher(ret))
    },
    // ap: ([name, , exp]) => {
    //   return Exp.ap(Exp.v(pt.Tree.token(name).value), exp_matcher(exp))
    // },
    ap: ([name, exp_in_paren_list]) => {
      let exp: Exp.Exp = Exp.v(pt.Tree.token(name).value)
      const args_list = pt.one_or_more_matcher(
        in_between_matcher(comma_separated_matcher(exp_matcher))
      )(exp_in_paren_list)
      for (const args of args_list) {
        for (const arg of args) {
          exp = Exp.ap(exp, arg)
        }
      }
      return exp
    },
    sigma: ([, name, , car_t, , , cdr_t]) => {
      return Exp.sigma(
        pt.Tree.token(name).value,
        exp_matcher(car_t),
        exp_matcher(cdr_t)
      )
    },
    pair: ([, , car_t, , cdr_t]) => {
      return Exp.sigma("_", exp_matcher(car_t), exp_matcher(cdr_t))
    },
    cons: ([, , car, , cdr]) => {
      return Exp.cons(exp_matcher(car), exp_matcher(cdr))
    },
    car: ([, , target]) => {
      return Exp.car(exp_matcher(target))
    },
    cdr: ([, , target]) => {
      return Exp.cdr(exp_matcher(target))
    },
    nat: (_) => {
      return Exp.nat
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
    nat_ind: ([, , , , target, , motive, , base, , step]) => {
      return Exp.nat_ind(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      )
    },
    equal: ([, , t, , from, , to]) => {
      return Exp.equal(exp_matcher(t), exp_matcher(from), exp_matcher(to))
    },
    same: (_) => {
      return Exp.same
    },
    replace: ([, , target, , motive, , base]) => {
      return Exp.replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      )
    },
    trivial: (_) => {
      return Exp.trivial
    },
    sole: (_) => {
      return Exp.sole
    },
    absurd: (_) => {
      return Exp.absurd
    },
    absurd_ind: ([, , , , target, , motive]) => {
      return Exp.absurd_ind(exp_matcher(target), exp_matcher(motive))
    },
    str: (_) => {
      return Exp.str
    },
    quote: ([str]) => {
      return Exp.quote(str_matcher(str))
    },
    type: (_) => {
      return Exp.type
    },
    suite: ([, defs, ret]) => {
      return Exp.suite(
        pt.zero_or_more_matcher(def_matcher)(defs),
        exp_matcher(ret)
      )
    },
    the: ([exp, , t]) => {
      return Exp.the(exp_matcher(t), exp_matcher(exp))
    },
  })(tree)
}

function comma_after(x: pt.Sym.Exp): pt.Sym.Rule {
  return pt.Sym.create_rule("comma_after", {
    comma_after: [x, ","],
  })
}

function comma_after_matcher<A>(
  matcher: (tree: pt.Tree.Tree) => A
): (tree: pt.Tree.Tree) => A {
  return pt.Tree.matcher("comma_after", {
    comma_after: ([x]) => matcher(x),
  })
}

function comma_separated(x: pt.Sym.Exp): pt.Sym.Rule {
  return pt.Sym.create_rule("comma_separated", {
    comma_separated: [pt.zero_or_more(comma_after(x)), x],
  })
}

function comma_separated_matcher<A>(
  matcher: (tree: pt.Tree.Tree) => A
): (tree: pt.Tree.Tree) => Array<A> {
  return pt.Tree.matcher("comma_separated", {
    comma_separated: ([comma_separated, x]) => {
      return [
        ...pt.zero_or_more_matcher(comma_after_matcher(matcher))(
          comma_separated
        ),
        matcher(x),
      ]
    },
  })
}

function in_between(before: string, x: pt.Sym.Exp, after: string): pt.Sym.Rule {
  return pt.Sym.create_rule("in_between", {
    in_between: [before, x, after],
  })
}

function in_between_matcher<A>(
  matcher: (tree: pt.Tree.Tree) => A
): (tree: pt.Tree.Tree) => A {
  return pt.Tree.matcher("in_between", {
    in_between: ([, x]) => matcher(x),
  })
}

function def(): pt.Sym.Rule {
  return pt.Sym.create_rule("def", {
    def: [identifier, "=", exp],
  })
}

function def_matcher(tree: pt.Tree.Tree): { name: string; exp: Exp.Exp } {
  return pt.Tree.matcher("def", {
    def: ([name, , exp]) => {
      return {
        name: pt.Tree.token(name).value,
        exp: exp_matcher(exp),
      }
    },
  })(tree)
}
