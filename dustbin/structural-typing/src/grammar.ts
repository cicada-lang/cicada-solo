import * as Top from "./top"
import * as Exp from "./exp"
import * as Scope from "./scope"
import pt from "@forchange/partech"
import rr from "@forchange/readable-regular-expression"

const preserved_identifiers = [
  "case",
  "type",
  "class",
  "string_t",
  "equation_t",
  "same",
  "transport",
]

const identifier = new pt.Sym.Pat(
  /^identifier/,
  rr.seq(
    rr.negative_lookahead(rr.beginning, rr.or(...preserved_identifiers)),
    rr.word
  )
)

const str = pt.Sym.create_par_from_kind("string")

function arg_entry(): pt.Sym.Rule {
  return pt.Sym.create_rule("arg_entry", {
    arg: [exp],
    arg_comma: [exp, ","],
  })
}

function arg_entry_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher("arg_entry", {
    arg: ([exp]) => exp_matcher(exp),
    arg_comma: ([exp, _]) => exp_matcher(exp),
  })(tree)
}

function top_entry(): pt.Sym.Rule {
  return pt.Sym.create_rule("top_entry", {
    named_entry: [named_entry],
    "@refuse": ["@", "refuse", exp, ":", exp],
    "@accept": ["@", "accept", exp, ":", exp],
    "@show": ["@", "show", exp],
    "@eq": ["@", "eq", exp, "=", exp],
  })
}

function top_entry_matcher(tree: pt.Tree.Tree): Top.Top {
  return pt.Tree.matcher<Top.Top>("top_entry", {
    named_entry: ([named_entry]) =>
      new Top.TopNamedScopeEntry(...named_entry_matcher(named_entry)),
    "@refuse": ([, , exp, , t]) =>
      new Top.TopKeywordRefuse(exp_matcher(exp), exp_matcher(t)),
    "@accept": ([, , exp, , t]) =>
      new Top.TopKeywordAccept(exp_matcher(exp), exp_matcher(t)),
    "@show": ([, , exp]) => new Top.TopKeywordShow(exp_matcher(exp)),
    "@eq": ([, , lhs, , rhs]) =>
      new Top.TopKeywordEq(exp_matcher(lhs), exp_matcher(rhs)),
  })(tree)
}

export function top_list(): pt.Sym.Rule {
  return pt.Sym.create_rule("top_list", {
    top_entry_list: [pt.one_or_more(top_entry)],
  })
}

export function top_list_matcher(tree: pt.Tree.Tree): Array<Top.Top> {
  return pt.Tree.matcher("top_list", {
    top_entry_list: ([top_entry_list]) =>
      pt.one_or_more_matcher(top_entry_matcher)(top_entry_list),
  })(tree)
}

function scope(): pt.Sym.Rule {
  return pt.Sym.create_rule("scope", {
    named_entries: [pt.one_or_more(named_entry)],
  })
}

function scope_matcher(tree: pt.Tree.Tree): Scope.Scope {
  return pt.Tree.matcher("scope", {
    named_entries: ([named_entries]) =>
      new Scope.Scope(
        pt.one_or_more_matcher(named_entry_matcher)(named_entries)
      ),
  })(tree)
}

function named_entry(): pt.Sym.Rule {
  return pt.Sym.create_rule("named_entry", {
    let: [identifier, "=", exp],
    let_comma: [identifier, "=", exp, ","],
    given: [identifier, ":", exp],
    given_comma: [identifier, ":", exp, ","],
    define: [identifier, ":", exp, "=", exp],
    define_comma: [identifier, ":", exp, "=", exp, ","],
    cl: ["class", identifier, "{", scope, "}"],
    cl_empty: ["class", identifier, "{", "}"],
  })
}

function named_entry_matcher(tree: pt.Tree.Tree): [string, Scope.Entry.Entry] {
  return pt.Tree.matcher<[string, Scope.Entry.Entry]>("named_entry", {
    let: ([name, , exp]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Let(exp_matcher(exp)),
    ],
    let_comma: ([name, , exp]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Let(exp_matcher(exp)),
    ],
    given: ([name, , t]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Given(exp_matcher(t)),
    ],
    given_comma: ([name, , t]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Given(exp_matcher(t)),
    ],
    define: ([name, , t, , exp]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp)),
    ],
    define_comma: ([name, , t, , exp]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp)),
    ],
    cl: ([, name, , scope]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(scope_matcher(scope))),
    ],
    cl_empty: ([, name, ,]) => [
      pt.Tree.token(name).value,
      new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(new Scope.Scope())),
    ],
  })(tree)
}

function exp(): pt.Sym.Rule {
  return pt.Sym.create_rule("exp", {
    var: [identifier],
    type: ["type"],
    string_t: ["string_t"],
    string: [str],
    pi: ["{", scope, "-", ">", exp, "}"],
    fn: ["{", scope, "=", ">", exp, "}"],
    fn_case: ["{", pt.one_or_more(fn_case_clause), "}"],
    ap: [exp, "(", pt.one_or_more(arg_entry), ")"],
    cl: ["class", "{", scope, "}"],
    cl_empty: ["class", "{", "}"],
    obj: ["{", scope, "}"],
    obj_empty: ["{", "}"],
    dot: [exp, ".", identifier],
    block: ["{", scope, exp, "}"],
    equation: ["equation_t", "(", exp, ",", exp, ",", exp, ")"],
    same: ["same", "(", exp, ",", exp, ")"],
    transport: ["transport", "(", exp, ",", exp, ",", exp, ")"],
  })
}

function exp_matcher(tree: pt.Tree.Tree): Exp.Exp {
  return pt.Tree.matcher("exp", {
    var: ([name]) => new Exp.Var(pt.Tree.token(name).value),
    type: (_) => new Exp.Type(),
    string_t: (_) => new Exp.StrType(),
    string: ([str]) => {
      const s = pt.Tree.token(str).value
      return new Exp.Str(s.slice(1, s.length - 1))
    },
    pi: ([, scope, , , return_type, _]) =>
      new Exp.Pi(scope_matcher(scope), exp_matcher(return_type)),
    fn: ([, scope, , , body, _]) =>
      new Exp.Fn(scope_matcher(scope), exp_matcher(body)),
    fn_case: ([, fn_case_clause_list, _]) =>
      new Exp.FnCase(
        pt.one_or_more_matcher(fn_case_clause_matcher)(fn_case_clause_list)
      ),
    ap: ([target, , arg_entry_list, _]) =>
      new Exp.Ap(
        exp_matcher(target),
        pt.one_or_more_matcher(arg_entry_matcher)(arg_entry_list)
      ),
    cl: ([, , scope, _]) => new Exp.Cl(scope_matcher(scope)),
    cl_empty: (_) => new Exp.Cl(new Scope.Scope()),
    obj: ([, scope, _]) => new Exp.Obj(scope_matcher(scope)),
    obj_empty: (_) => new Exp.Obj(new Scope.Scope()),
    dot: ([target, , field_name]) =>
      new Exp.Dot(exp_matcher(target), pt.Tree.token(field_name).value),
    block: ([, scope, body, _]) =>
      new Exp.Block(scope_matcher(scope), exp_matcher(body)),
    equation: ([, , t, , lhs, , rhs]) =>
      new Exp.Equation(exp_matcher(t), exp_matcher(lhs), exp_matcher(rhs)),
    same: ([, , t, , value]) =>
      new Exp.Same(exp_matcher(t), exp_matcher(value)),
    transport: ([, , equation, , motive, , base]) =>
      new Exp.Transport(
        exp_matcher(equation),
        exp_matcher(motive),
        exp_matcher(base)
      ),
  })(tree)
}

function fn_case_clause(): pt.Sym.Rule {
  return pt.Sym.create_rule("fn_case_clause", {
    case: ["case", scope, "=", ">", exp],
  })
}

function fn_case_clause_matcher(tree: pt.Tree.Tree): Exp.Fn {
  return pt.Tree.matcher("fn_case_clause", {
    case: ([, scope, , , body]) =>
      new Exp.Fn(scope_matcher(scope), exp_matcher(body)),
  })(tree)
}
