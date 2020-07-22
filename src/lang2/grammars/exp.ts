import * as Exp from "../exp"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

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

function str_match(tree: pt.Tree.Tree): string {
  const s = pt.Tree.token(tree).value
  return s.slice(1, s.length - 1)
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
    // TODO can not use the following,
    //   low level partech bug.
    // pi: ["(", comma_separated(type_assignment), ")", "-", ">", exp],
    pi: ["(", type_assignment, ")", "-", ">", exp],
    fn: ["(", comma_separated(identifier), ")", "=", ">", exp],
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
      return {
        kind: "Exp.Var",
        name: pt.Tree.token(name).value,
      }
    },
    // pi: ([, comma_separated_type_assignments, , , , ret_t]) => {
    //   const type_assignments = comma_separated_matcher(type_assignment_matcher)(
    //     comma_separated_type_assignments
    //   )
    //   let exp = exp_matcher(ret_t)
    //   for (let i = type_assignments.length - 1; i >= 0; i--) {
    //     exp = {
    //       kind: "Exp.Pi",
    //       name: type_assignments[i].name,
    //       arg_t: type_assignments[i].t,
    //       ret_t: exp,
    //     }
    //   }
    //   return exp
    // },
    pi: ([, type_assignment, , , , ret_t]) => {
      const { name, t } = type_assignment_matcher(type_assignment)
      return {
        kind: "Exp.Pi",
        name: name,
        arg_t: t,
        ret_t: exp_matcher(ret_t),
      }
    },
    fn: ([, comma_separated_names, , , , body]) => {
      const names = comma_separated_matcher(
        (name) => pt.Tree.token(name).value
      )(comma_separated_names)
      let exp = exp_matcher(body)
      for (let i = names.length - 1; i >= 0; i--) {
        exp = {
          kind: "Exp.Fn",
          name: names[i],
          body: exp,
        }
      }
      return exp
    },
    ap: ([name, exp_in_paren_list]) => {
      let exp: Exp.Exp = {
        kind: "Exp.Var",
        name: pt.Tree.token(name).value,
      }
      const args_list = pt.one_or_more_matcher(
        in_between_matcher(comma_separated_matcher(exp_matcher))
      )(exp_in_paren_list)
      for (const args of args_list) {
        for (const arg of args) {
          exp = {
            kind: "Exp.Ap",
            target: exp,
            arg: arg,
          }
        }
      }
      return exp
    },
    sigma: ([, name, , car_t, , , cdr_t]) => {
      return {
        kind: "Exp.Sigma",
        name: pt.Tree.token(name).value,
        car_t: exp_matcher(car_t),
        cdr_t: exp_matcher(cdr_t),
      }
    },
    pair: ([, , car_t, , cdr_t]) => {
      return {
        kind: "Exp.Sigma",
        name: "_",
        car_t: exp_matcher(car_t),
        cdr_t: exp_matcher(cdr_t),
      }
    },
    cons: ([, , car, , cdr]) => {
      return {
        kind: "Exp.Cons",
        car: exp_matcher(car),
        cdr: exp_matcher(cdr),
      }
    },
    car: ([, , target]) => {
      return {
        kind: "Exp.Car",
        target: exp_matcher(target),
      }
    },
    cdr: ([, , target]) => {
      return {
        kind: "Exp.Cdr",
        target: exp_matcher(target),
      }
    },
    nat: (_) => {
      return { kind: "Exp.Nat" }
    },
    zero: (_) => {
      return { kind: "Exp.Zero" }
    },
    add1: ([, , prev]) => {
      return { kind: "Exp.Add1", prev: exp_matcher(prev) }
    },
    nat_ind: ([, , , , target, , motive, , base, , step]) => {
      return {
        kind: "Exp.NatInd",
        target: exp_matcher(target),
        motive: exp_matcher(motive),
        base: exp_matcher(base),
        step: exp_matcher(step),
      }
    },
    equal: ([, , t, , from, , to]) => {
      return {
        kind: "Exp.Equal",
        t: exp_matcher(t),
        from: exp_matcher(from),
        to: exp_matcher(to),
      }
    },
    same: (_) => {
      return { kind: "Exp.Same" }
    },
    replace: ([, , target, , motive, , base]) => {
      return {
        kind: "Exp.Replace",
        target: exp_matcher(target),
        motive: exp_matcher(motive),
        base: exp_matcher(base),
      }
    },
    trivial: (_) => {
      return { kind: "Exp.Trivial" }
    },
    sole: (_) => {
      return { kind: "Exp.Sole" }
    },
    absurd: (_) => {
      return { kind: "Exp.Absurd" }
    },
    absurd_ind: ([, , , , target, , motive]) => {
      return {
        kind: "Exp.AbsurdInd",
        target: exp_matcher(target),
        motive: exp_matcher(motive),
      }
    },
    str: (_) => {
      return { kind: "Exp.Str" }
    },
    quote: ([str]) => {
      return { kind: "Exp.Quote", str: str_match(str) }
    },
    type: (_) => {
      return { kind: "Exp.Type" }
    },
    suite: ([, defs, body]) => {
      return {
        kind: "Exp.Suite",
        defs: pt.zero_or_more_matcher(def_matcher)(defs),
        body: exp_matcher(body),
      }
    },
    the: ([exp, , t]) => {
      return {
        kind: "Exp.The",
        t: exp_matcher(t),
        exp: exp_matcher(exp),
      }
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
