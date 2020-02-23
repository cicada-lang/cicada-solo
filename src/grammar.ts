import * as ptc from "@forchange/partech"
import * as Top from "./top"
import * as Exp from "./exp"
import * as Scope from "./scope"

const preserved = [
  "type", "class",
  "case",
  "string_t",
  "equation_t", "same", "transport",
]

const identifier = ptc.identifier_with_preserved("identifier", preserved)

const arg_entry =
  new ptc.Rule(
    "arg_entry", {
      "arg": [exp],
      "arg_comma": [exp, ","],
    })

const arg_entry_matcher =
  ptc.Node.matcher_with_span<Exp.Exp>(
    span => [
      "arg_entry", {
        "arg": ([exp]) => exp_matcher(exp),
        "arg_comma": ([exp, _]) => exp_matcher(exp),
      }
    ])

const top_entry =
  new ptc.Rule(
    "top_entry", {
      "named_entry": [named_entry],
      "@refuse": ["@", "refuse", exp, ":", exp],
      "@accept": ["@", "accept", exp, ":", exp],
      "@show": ["@", "show", exp],
      "@eq": ["@", "eq", exp, "=", exp],
    })

const top_entry_matcher =
  ptc.Node.matcher_with_span<Top.Top>(
    span => [
      "top_entry", {
        "named_entry": ([named_entry]) =>
          new Top.TopNamedScopeEntry(...named_entry_matcher(named_entry)),
        "@refuse": ([, , exp, , t]) =>
          new Top.TopKeywordRefuse(exp_matcher(exp), exp_matcher(t)),
        "@accept": ([, , exp, , t]) =>
          new Top.TopKeywordAccept(exp_matcher(exp), exp_matcher(t)),
        "@show": ([, , exp]) =>
          new Top.TopKeywordShow(exp_matcher(exp)),
        "@eq": ([, , lhs, , rhs]) =>
          new Top.TopKeywordEq(exp_matcher(lhs), exp_matcher(rhs)),
      }
    ])

export const top_list =
  new ptc.Rule(
    "top_list", {
      "top_entry_list": [ptc.ap(ptc.non_empty_list, top_entry)],
    })


export const top_list_matcher =
  ptc.Node.matcher_with_span<Array<Top.Top>>(
    span => [
      "top_list", {
        "top_entry_list": ([top_entry_list]) =>
          ptc.non_empty_list_matcher(top_entry_matcher)(top_entry_list),
      }
    ])

const scope =
  new ptc.Rule(
    "scope", {
      "named_entries": [ptc.ap(ptc.non_empty_list, named_entry)],
    })

const scope_matcher : (tree: ptc.Tree) => Scope.Scope =
  ptc.Node.matcher_with_span<Scope.Scope>(
    span => [
      "scope", {
        "named_entries": ([named_entries]) =>
          new Scope.Scope(ptc.non_empty_list_matcher(named_entry_matcher)(named_entries)),
      }
    ])

function named_entry(): ptc.Rule {
  return new ptc.Rule(
    "named_entry", {
      "let": [identifier, "=", exp],
      "let_comma": [identifier, "=", exp, ","],
      "given": [identifier, ":", exp],
      "given_comma": [identifier, ":", exp, ","],
      "define": [identifier, ":", exp, "=", exp],
      "define_comma": [identifier, ":", exp, "=", exp, ","],
      "cl": ["class", identifier, "{", scope, "}"],
      "cl_empty": ["class", identifier, "{", "}"],
    })
}

const named_entry_matcher : (tree: ptc.Tree) => [string, Scope.Entry.Entry] =
  ptc.Node.matcher_with_span<[string, Scope.Entry.Entry]>(
    span => [
      "named_entry", {
        "let": ([name, , exp]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "let_comma": ([name, , exp, ]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "given": ([name, , t]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "given_comma": ([name, , t, ]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "define": ([name, , t, , exp]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
        "define_comma": ([name, , t, , exp, ]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
        "cl": ([ , name, , scope, ]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(scope_matcher(scope)))],
        "cl_empty": ([ , name, , ]) =>
          [ptc.Leaf.word(name), new Scope.Entry.Define(new Exp.Type(), new Exp.Cl(new Scope.Scope()))],
      }
    ])

function exp(): ptc.Rule {
  return new ptc.Rule(
    "exp", {
      "var": [identifier],
      "type": ["type"],
      "string_t": ["string_t"],
      "string": [ptc.double_quoted_string],
      "pi": ["{", scope, "-", ">", exp, "}"],
      "fn": ["{", scope, "=", ">", exp, "}"],
      "fn_case": ["{", ptc.ap(ptc.non_empty_list, fn_case_clause), "}"],
      "ap": [exp, "(", ptc.ap(ptc.non_empty_list, arg_entry), ")"],
      "cl": [ "class", "{", scope, "}"],
      "cl_empty": ["class", "{", "}"],
      "obj": ["{", scope, "}"],
      "obj_empty": ["{", "}"],
      "dot": [exp, ".", identifier],
      "block": ["{", scope, exp, "}"],
      "equation": ["equation_t", "(", exp, ",", exp, ",", exp, ")"],
      "same": ["same", "(", exp, ",", exp, ")"],
      "transport": ["transport", "(", exp, ",", exp, ",", exp, ")"],
    })
}

const exp_matcher: (tree: ptc.Tree) => Exp.Exp =
  ptc.Node.matcher_with_span<Exp.Exp>(
    span => [
      "exp", {
        "var": ([name]) => new Exp.Var(ptc.Leaf.word(name)),
        "type": _ =>  new Exp.Type(),
        "string_t": _ =>  new Exp.StrType(),
        "string": ([str]) => {
          let s = ptc.Leaf.quoted_string_token(str).value
          return new Exp.Str(s)
        },
        "pi": ([, scope, , , return_type, _]) =>
          new Exp.Pi(scope_matcher(scope), exp_matcher(return_type)),
        "fn": ([, scope, , , body, _]) =>
        new Exp.Fn(scope_matcher(scope), exp_matcher(body)) ,
        "fn_case": ([, fn_case_clause_list, _]) =>
          new Exp.FnCase(ptc.non_empty_list_matcher(fn_case_clause_matcher)(fn_case_clause_list)),
        "ap": ([target, , arg_entry_list, _]) =>
          new Exp.Ap(
            exp_matcher(target),
            ptc.non_empty_list_matcher(arg_entry_matcher)(arg_entry_list)),
        "cl": ([, , scope, _]) =>
          new Exp.Cl(scope_matcher(scope)),
        "cl_empty": _ =>
          new Exp.Cl(new Scope.Scope()),
        "obj": ([, scope, _]) =>
          new Exp.Obj(scope_matcher(scope)),
        "obj_empty": _ =>
          new Exp.Obj(new Scope.Scope()),
        "dot": ([target, , field_name]) =>
          new Exp.Dot(exp_matcher(target), ptc.Leaf.word(field_name)),
        "block": ([, scope, body, _]) =>
          new Exp.Block(scope_matcher(scope), exp_matcher(body)),
        "equation": ([, , t, , lhs, , rhs, ]) =>
          new Exp.Equation(exp_matcher(t), exp_matcher(lhs), exp_matcher(rhs)),
        "same": ([, , t, , value, ]) =>
          new Exp.Same(exp_matcher(t), exp_matcher(value)),
        "transport": ([, , equation, , motive, , base, ]) =>
          new Exp.Transport(exp_matcher(equation), exp_matcher(motive), exp_matcher(base)),
      }
    ])

const fn_case_clause =
  new ptc.Rule(
    "fn_case_clause", {
      "case": ["case", scope, "=", ">", exp],
    })

const fn_case_clause_matcher =
  ptc.Node.matcher_with_span<Exp.Fn>(
    span => [
      "fn_case_clause", {
        "case": ([, scope, , , body]) =>
          new Exp.Fn(scope_matcher(scope), exp_matcher(body)) ,
      }
    ])
