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

const preserved = [
  "type", "class",
  "case",
  "string_t",
]

const identifier = ptc.identifier_with_preserved("identifier", preserved)

function top_entry(): Rule {
  return new Rule(
    "top_entry", {
      "block_entry": [block_entry],
      "@refuse": ["@", "refuse", exp, ":", exp],
      "@accept": ["@", "accept", exp, ":", exp],
      "@show": ["@", "show", exp],
      "@eq": ["@", "eq", exp, "=", exp],
    })
}

//   def top_entry_matcher: Tree => Top =
//     Tree.matcher[Top](
//       "top_entry", Map(
//         "block_entry" -> { case List(block_entry) =>
//           block_entry_matcher(block_entry) match {
//             case (name, block_entry) =>
//               block_entry match {
//                 case BlockEntryLet(value: Exp) =>
//                   TopLet(name, value)
//                 case BlockEntryDefine(t: Exp, value: Exp) =>
//                   TopDefine(name, t, value)
//               }
//           } },
//         "@refuse" -> { case List(_, _, exp, _, t) =>
//           TopKeywordRefuse(exp_matcher(exp), exp_matcher(t)) },
//         "@accept" -> { case List(_, _, exp, _, t) =>
//           TopKeywordAccept(exp_matcher(exp), exp_matcher(t)) },
//         "@show" -> { case List(_, _, exp) =>
//           TopKeywordShow(exp_matcher(exp)) },
//         "@eq" -> { case List(_, _, rhs, _, lhs) =>
//           TopKeywordEq(exp_matcher(rhs), exp_matcher(lhs)) },
//       ))

export const top_list: Sym = $(ptc.non_empty_list, top_entry)

//   def top_list_matcher = non_empty_list_matcher(top_entry_matcher)

function exp(): Rule {
  return new Rule(
    "exp", {
      "var": [identifier],
      "type": ["type"],
      "string_t": ["string_t"],
      "string": [ptc.double_quoted_string],
      "pi": ["{", $(ptc.non_empty_list, given_entry), "-", ">", exp, "}"],
      "fn": ["{", $(ptc.non_empty_list, given_entry), "=", ">", exp, "}"],
      "fn_case": ["{", $(ptc.non_empty_list, fn_case_clause), "}"],
      "ap": [exp, "(", $(ptc.non_empty_list, arg_entry), ")"],
      "cl": ["class", "{", $(ptc.non_empty_list, given_entry), "}"],
      "cl_predefined": ["class", "{",
                        $(ptc.non_empty_list, define_entry),
                        $(ptc.non_empty_list, given_entry),
                        "}"],
      "cl_predefined_empty_given": ["class", "{", $(ptc.non_empty_list, define_entry), "}"],
      "cl_naked": ["{", $(ptc.non_empty_list, given_entry), "}"],
      "cl_empty": ["class", "{", "}"],
      "obj": ["object", "{", $(ptc.non_empty_list, let_entry), "}"],
      "obj_naked": ["{", $(ptc.non_empty_list, let_entry), "}"],
      "obj_empty": ["object", "{", "}"],
      "obj_naked_empty": ["{", "}"],
      "dot": [exp, ".", identifier],
      "block": ["{", $(ptc.non_empty_list, block_entry), exp, "}"],
      "the": ["the", "(", exp, ",", exp, ")"],
    })
}

//   def exp_matcher: Tree => Exp =
//     Tree.matcher[Exp](
//       "exp", Map(
//         "var" -> { case List(Leaf(name)) => Var(name.word) },
//         "type" -> { case List(_) => Type() },
//         "string_t" -> { case List(_) => StrType() },
//         "string" -> { case List(Leaf(str)) =>
//           Str(trim_double_quote(str.word)) },
//         "pi" -> { case List(_, given_entry_list, _, _, return_type, _) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           Pi(type_map, exp_matcher(return_type)) },
//         "fn" -> { case List(_, given_entry_list, _, _, body, _) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           Fn(type_map, exp_matcher(body)) },
//         "fn_case" -> { case List(_, fn_case_clause_list, _) =>
//           FnCase(non_empty_list_matcher(fn_case_clause_matcher)(fn_case_clause_list)) },
//         "ap" -> { case List(target, _, arg_entry_list, _) =>
//           val args = non_empty_list_matcher(arg_entry_matcher)(arg_entry_list)
//           Ap(exp_matcher(target), args) },
//         "cl" -> { case List(_, _, given_entry_list, _) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           Cl(ListMap.empty, type_map) },
//         "cl_predefined" -> { case List(
//           _, _, define_entry_list, given_entry_list, _) =>
//           val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           Cl(defined, type_map) },
//         "cl_predefined_empty_given" -> { case List(
//           _, _, define_entry_list, _) =>
//           val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
//           Cl(defined, ListMap()) },
//         "cl_naked" -> { case List(_, given_entry_list, _) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           Cl(ListMap.empty, type_map) },
//         "cl_empty" -> { case List(_, _, _) =>
//           Cl(ListMap.empty, ListMap.empty) },
//         "obj" -> { case List(_, _, let_entry_list, _) =>
//           val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
//           Obj(value_map) },
//         "obj_naked" -> { case List(_, let_entry_list, _) =>
//           val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
//           Obj(value_map) },
//         "obj_empty" -> { case List(_, _, _) =>
//           Obj(ListMap.empty) },
//         "obj_naked_empty" -> { case List(_, _) =>
//           Obj(ListMap()) },
//         "dot" -> { case List(target, _, Leaf(field_name)) =>
//           Dot(exp_matcher(target), field_name.word) },
//         "block" -> { case List(_, block_entry_list, body, _) =>
//           val block_entry_map = ListMap(non_empty_list_matcher(block_entry_matcher)(block_entry_list): _*)
//           Block(block_entry_map, exp_matcher(body)) },
//       ))

function fn_case_clause(): Rule {
  return new Rule(
    "fn_case_clause", {
      "case": ["case", $(ptc.non_empty_list, given_entry), "=", ">", exp],
    })
}

//   def fn_case_clause_matcher =
//     Tree.matcher[(ListMap[String, Exp], Exp)](
//       "fn_case_clause", Map(
//         "case" -> { case List(_, given_entry_list, _, _, body) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           (type_map, exp_matcher(body)) },
//       ))

function arg_entry(): Rule {
  return new Rule(
    "arg_entry", {
      "arg": [exp],
      "arg_comma": [exp, ","],
    })
}

//   def arg_entry_matcher =
//     Tree.matcher[Exp](
//       "arg_entry", Map(
//         "arg" -> { case List(exp) => exp_matcher(exp) },
//         "arg_comma" -> { case List(exp, _) => exp_matcher(exp) },
//       ))

function given_entry(): Rule {
  return new Rule(
    "given_entry", {
      "given": [identifier, ":", exp],
      "given_comma": [identifier, ":", exp, ","],
    })
}

//   def given_entry_matcher =
//     Tree.matcher[(String, Exp)](
//       "given_entry", Map(
//         "given" -> { case List(Leaf(name), _, exp) => (name.word, exp_matcher(exp)) },
//         "given_comma" -> { case List(Leaf(name), _, exp, _) => (name.word, exp_matcher(exp)) },
//       ))

function let_entry(): Rule {
  return new Rule(
    "let_entry", {
      "let": [identifier, "=", exp],
      "let_comma": [identifier, "=", exp, ","],
    })
}

//   def let_entry_matcher =
//     Tree.matcher[(String, Exp)](
//       "let_entry", Map(
//         "let" -> { case List(Leaf(name), _, exp) => (name.word, exp_matcher(exp)) },
//         "let_comma" -> { case List(Leaf(name), _, exp, _) => (name.word, exp_matcher(exp)) },
//       ))

function define_entry(): Rule {
  return new Rule(
    "define_entry", {
      "define": [identifier, ":", exp, "=", exp],
    })
}

//   def define_entry_matcher =
//     Tree.matcher[(String, (Exp, Exp))](
//       "define_entry", Map(
//         "define" -> { case List(Leaf(name), _, t, _, exp) =>
//           (name.word, (exp_matcher(t), exp_matcher(exp))) },
//       ))

function block_entry(): Rule {
  return new Rule(
    "block_entry", {
      "let": [identifier, "=", exp],
      "let_cl": [
        "class", identifier, "{",
        $(ptc.non_empty_list, given_entry),
        "}"],
      "let_cl_predefined": [
        "class", identifier, "{",
        $(ptc.non_empty_list, define_entry),
        $(ptc.non_empty_list, given_entry),
        "}"],
      "let_cl_predefined_empty_given": [
        "class", identifier, "{",
        $(ptc.non_empty_list, define_entry),
        "}"],
      "let_cl_empty": [
        "class", identifier, "{", "}"],
      "let_obj": [
        "object", identifier, "{",
        $(ptc.non_empty_list, let_entry),
        "}"],
      "let_obj_empty": ["object", identifier, "{", "}"],
      "define": [identifier, ":", exp, "=", exp],
    })
}

//   def block_entry_matcher: Tree => (String, BlockEntry) =
//     Tree.matcher[(String, BlockEntry)](
//       "block_entry", Map(
//         "let" -> { case List(Leaf(name), _, exp) =>
//           (name.word, BlockEntryLet(exp_matcher(exp))) },
//         "let_cl" -> { case List(_, Leaf(name), _, given_entry_list, _) =>
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           (name.word, BlockEntryDefine(Type(), Cl(ListMap.empty, type_map))) },
//         "let_cl_predefined" -> { case List(_, Leaf(name), _,
//           define_entry_list,
//           given_entry_list,
//           _) =>
//           val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
//           val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
//           (name.word, BlockEntryDefine(Type(), Cl(defined, type_map))) },
//         "let_cl_predefined_empty_given" -> { case List(_, Leaf(name), _,
//           define_entry_list,
//           _) =>
//           val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
//           (name.word, BlockEntryDefine(Type(), Cl(defined, ListMap.empty))) },
//         "let_cl_empty" -> { case List(_, Leaf(name), _, _) =>
//           (name.word, BlockEntryDefine(Type(), Cl(ListMap.empty, ListMap.empty))) },
//         "let_obj" -> { case List(_, Leaf(name), _, let_entry_list, _) =>
//           val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
//           (name.word, BlockEntryLet(Obj(value_map))) },
//         "let_obj_empty" -> { case List(_, Leaf(name), _, _) =>
//           (name.word, BlockEntryLet(Obj(ListMap.empty))) },
//         "define" -> { case List(Leaf(name), _, t, _, exp) =>
//           (name.word, BlockEntryDefine(exp_matcher(t), exp_matcher(exp))) },
//       ))
