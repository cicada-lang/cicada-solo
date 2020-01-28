import { ErrorDuringParsing } from "@forchange/partech/lib/error"
import { Rule, Sym } from "@forchange/partech/lib/rule"
import { Token } from "@forchange/partech/lib/token"
import { Lexer } from "@forchange/partech/lib/lexer"
import { Parser } from "@forchange/partech/lib/parser"
import { Partech } from "@forchange/partech/lib/partech"
import * as AST from "@forchange/partech/lib/tree"
import { Earley } from "@forchange/partech/lib/earley"
import * as ptc from "@forchange/partech/lib/predefined"
import { ap as $ } from "@forchange/partech/lib/predefined"

import * as Top from "./top"
import * as Exp from "./exp"
import * as Scope from "./scope"

const preserved = [
  "type", "class",
  "case",
  "string_t",
]

const identifier = ptc.identifier_with_preserved("identifier", preserved)

function top_entry(): Rule {
  return new Rule(
    "top_entry", {
      "named_entry": [named_entry],
      "@refuse": ["@", "refuse", exp, ":", exp],
      "@accept": ["@", "accept", exp, ":", exp],
      "@show": ["@", "show", exp],
      "@eq": ["@", "eq", exp, "=", exp],
    })
}

const top_entry_matcher =
  AST.Node.matcher_with_span<Top.Top>(
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
        "@eq": ([, , rhs, , lhs]) =>
          new Top.TopKeywordEq(exp_matcher(rhs), exp_matcher(lhs)),
      }
    ])

export function top_list(): Rule {
  return new Rule(
    "top_list", {
      "top_entry_list": [$(ptc.non_empty_list, top_entry)],
    }
  )
}

export const top_list_matcher =
  AST.Node.matcher_with_span<Array<Top.Top>>(
    span => [
      "top_list", {
        "top_entry_list": ([top_entry_list]) =>
          ptc.non_empty_list_matcher(top_entry_matcher)(top_entry_list),
      }
    ])

function scope(): Rule {
  return new Rule(
    "scope", {
      "named_entries": [$(ptc.non_empty_list, named_entry)],
    })
}

const scope_matcher : (tree: AST.Tree) => Scope.Scope =
  AST.Node.matcher_with_span<Scope.Scope>(
    span => [
      "scope", {
        "named_entries": ([named_entries]) =>
          new Scope.Scope(ptc.non_empty_list_matcher(named_entry_matcher)(named_entries)),
      }
    ])

function named_entry(): Rule {
  return new Rule(
    "named_entry", {
      "let": [identifier, "=", exp],
      "let_comma": [identifier, "=", exp, ","],
      "given": [identifier, ":", exp],
      "given_comma": [identifier, ":", exp, ","],
      "define": [identifier, ":", exp, "=", exp],
      "define_comma": [identifier, ":", exp, "=", exp, ","],
    })
}

// TODO
// function block_entry(): Rule {
//   return new Rule(
//     "block_entry", {
//       "let": [identifier, "=", exp],
//       "let_cl": [
//         "class", identifier, "{",
//         $(ptc.non_empty_list, given_entry),
//         "}"],
//       "let_cl_predefined": [
//         "class", identifier, "{",
//         $(ptc.non_empty_list, define_entry),
//         $(ptc.non_empty_list, given_entry),
//         "}"],
//       "let_cl_predefined_empty_given": [
//         "class", identifier, "{",
//         $(ptc.non_empty_list, define_entry),
//         "}"],
//       "let_cl_empty": [
//         "class", identifier, "{", "}"],
//       "let_obj": [
//         "object", identifier, "{",
//         $(ptc.non_empty_list, let_entry),
//         "}"],
//       "let_obj_empty": ["object", identifier, "{", "}"],
//       "define": [identifier, ":", exp, "=", exp],
//     })
// }

const named_entry_matcher : (tree: AST.Tree) => [string, Scope.Entry.Entry] =
  AST.Node.matcher_with_span<[string, Scope.Entry.Entry]>(
    span => [
      "named_entry", {
        "let": ([name, , exp]) =>
          [AST.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "let_comma": ([name, , exp, ]) =>
          [AST.Leaf.word(name), new Scope.Entry.Let(exp_matcher(exp))],
        "given": ([name, , t]) =>
          [AST.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "given_comma": ([name, , t, ]) =>
          [AST.Leaf.word(name), new Scope.Entry.Given(exp_matcher(t))],
        "define": ([name, , t, , exp]) =>
          [AST.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
        "define_comma": ([name, , t, , exp, ]) =>
          [AST.Leaf.word(name), new Scope.Entry.Define(exp_matcher(t), exp_matcher(exp))],
      }
    ])

function exp(): Rule {
  return new Rule(
    "exp", {
      "var": [identifier],
      "type": ["type"],
      "string_t": ["string_t"],
      "string": [ptc.double_quoted_string],
      "pi": ["{", scope, "-", ">", exp, "}"],
      "fn": ["{", scope, "=", ">", exp, "}"],
      "fn_case": ["{", $(ptc.non_empty_list, fn_case_clause), "}"],
      "ap": [exp, "(", $(ptc.non_empty_list, arg_entry), ")"],
      "cl": [ "class", "{", scope, "}"],
      "cl_empty": ["class", "{", "}"],
      "obj": ["{", scope, "}"],
      "obj_empty": ["{", "}"],
      "dot": [exp, ".", identifier],
      "block": ["{", scope, exp, "}"],
    })
}

const exp_matcher: (tree: AST.Tree) => Exp.Exp =
  AST.Node.matcher_with_span<Exp.Exp>(
    span => [
      "exp", {
        "var": ([name]) => new Exp.Var(AST.Leaf.word(name)),
        "type": _ =>  new Exp.Type(),
        "string_t": _ =>  new Exp.StrType(),
        "string": ([str]) => {
          let s = AST.Leaf.word(str)
          return new Exp.Str(s.slice(1, s.length - 1))
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
          new Exp.Dot(exp_matcher(target), AST.Leaf.word(field_name)),
        "block": ([, scope, body, _]) =>
          new Exp.Block(scope_matcher(scope), exp_matcher(body)),
      }
    ])

function fn_case_clause(): Rule {
  return new Rule(
    "fn_case_clause", {
      "case": ["case", scope, "=", ">", exp],
    })
}

const fn_case_clause_matcher =
  AST.Node.matcher_with_span<Exp.Fn>(
    span => [
      "fn_case_clause", {
        "case": ([, scope, , , body]) =>
          new Exp.Fn(scope_matcher(scope), exp_matcher(body)) ,
      }
    ])

function arg_entry(): Rule {
  return new Rule(
    "arg_entry", {
      "arg": [exp],
      "arg_comma": [exp, ","],
    })
}

const arg_entry_matcher =
  AST.Node.matcher_with_span<Exp.Exp>(
    span => [
      "arg_entry", {
        "arg": ([exp]) => exp_matcher(exp),
        "arg_comma": ([exp, _]) => exp_matcher(exp),
      }
    ])
