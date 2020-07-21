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
  "succ",
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

export function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    pi: ["(", identifier, ":", exp, ")", "-", ">", exp],
    arrow: ["(", exp, ")", "-", ">", exp],
    fn: ["(", comma_separated_names, ")", "=", ">", exp],
    ap: [identifier, pt.one_or_more(exp_in_paren)],
    sigma: ["(", identifier, ":", exp, ")", "*", exp],
    pair: ["Pair", "(", exp, ",", exp, ")"],
    cons: ["cons", "(", exp, ",", exp, ")"],
    car: ["car", "(", exp, ")"],
    cdr: ["cdr", "(", exp, ")"],
    nat: ["Nat"],
    zero: ["zero"],
    succ: ["succ", "(", exp, ")"],
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
    pi: ([, name, , arg_t, , , , ret_t]) => {
      return {
        kind: "Exp.Pi",
        name: pt.Tree.token(name).value,
        arg_t: exp_matcher(arg_t),
        ret_t: exp_matcher(ret_t),
      }
    },
    arrow: ([, arg_t, , , , ret_t]) => {
      return {
        kind: "Exp.Pi",
        name: "_",
        arg_t: exp_matcher(arg_t),
        ret_t: exp_matcher(ret_t),
      }
    },
    fn: ([, comma_separated_names, , , , body]) => {
      const names = comma_separated_names_matcher(comma_separated_names)
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
      const args = pt.one_or_more_matcher(exp_in_paren_matcher)(
        exp_in_paren_list
      )
      for (const arg of args) {
        exp = {
          kind: "Exp.Ap",
          target: exp,
          arg: arg,
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
    succ: ([, , prev]) => {
      return { kind: "Exp.Succ", prev: exp_matcher(prev) }
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

function comma_name(): pt.Sym.Rule {
  return pt.Sym.create_rule("comma_name", {
    comma_name: [identifier, ","],
  })
}

export function comma_name_matcher(tree: pt.Tree.Tree): string {
  return pt.Tree.matcher("comma_name", {
    comma_name: ([name]) => pt.Tree.token(name).value,
  })(tree)
}

function comma_separated_names(): pt.Sym.Rule {
  return pt.Sym.create_rule("comma_separated_names", {
    comma_separated_names: [pt.zero_or_more(comma_name), identifier],
  })
}

function comma_separated_names_matcher(tree: pt.Tree.Tree): Array<string> {
  return pt.Tree.matcher("comma_separated_names", {
    comma_separated_names: ([comma_names, last_name]) => [
      ...pt.zero_or_more_matcher(comma_name_matcher)(comma_names),
      pt.Tree.token(last_name).value,
    ],
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
