package xieyuheng.cicada

import collection.immutable.ListMap

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

// TODO
//   grammar need proper abstraction
//   currently a lot of code are repeating

object grammar {

  val lexer = Lexer.default

  def preserved: List[String] = List(
    "type",
    "class",
    "claim", "define",
    "given", "conclude",
    "let", "return",
    "union", "switch",
    "function",
    "string_t",
  )

  def identifier = identifier_with_preserved("identifier", preserved)

  def top_list = non_empty_list(top_entry)

  def top_entry = Rule(
    "top_entry", Map(
      "let" -> List("let", identifier, "=", exp),
      "let_cl" -> List("class", identifier, "{", non_empty_list(given_entry), "}"),
      "let_cl_empty" -> List("class", identifier, "{", "}"),
      "let_obj" -> List("object", identifier, "{", non_empty_list(let_entry), "}"),
      "let_obj_empty" -> List("object", identifier, "{", "}"),
      "let_function" -> List("function", identifier, "{",
        non_empty_list(given_entry),
        "conclude", exp,
        "return", exp,
        "}"),
      "let_function_block" -> List("function", identifier, "{",
        non_empty_list(given_entry),
        "conclude", exp,
        non_empty_list(block_entry),
        "return", exp,
        "}"),
      "define" -> List("define", identifier, ":", exp, "=", exp),
      // extends block_entry
      "@refuse" -> List("@", "refuse", exp, ":", exp),
      "@show" -> List("@", "show", exp),
    ))

  def top_entry_matcher = Tree.matcher[Top](
    "top_entry", Map(
      "let" -> { case List(_, Leaf(name), _, exp) =>
        TopLet(name, exp_matcher(exp)) },
      "let_cl" -> { case List(_, Leaf(name), _, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        TopDefine(name, Type(), Cl(ListMap.empty, type_map)) },
      "let_cl_empty" -> { case List(_, Leaf(name), _, _) =>
        TopDefine(name, Type(), Cl(ListMap.empty, ListMap.empty)) },
      "let_obj" -> { case List(_, Leaf(name), _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        TopLet(name, Obj(value_map)) },
      "let_obj_empty" -> { case List(_, Leaf(name), _, _) =>
        TopLet(name, Obj(ListMap.empty)) },
      "let_function" -> { case List(_, Leaf(name), _,
        given_entry_list,
        _, return_type,
        _, body,
        _) =>
        val pi = Pi(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(return_type))
        val fn = Fn(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(body))
        TopDefine(name, pi, fn) },
      "let_function_block" -> { case List(_, Leaf(name), _,
        given_entry_list,
        _, return_type,
        block_entry_list,
        _, body,
        _) =>
        val pi = Pi(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(return_type))
        val block = Block(
          ListMap(non_empty_list_matcher(block_entry_matcher)(block_entry_list): _*),
          exp_matcher(body))
        val fn = Fn(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          block)
        TopDefine(name, pi, fn) },
      "define" -> { case List(_, Leaf(name), _, t, _, exp) =>
        TopDefine(name, exp_matcher(t), exp_matcher(exp)) },
      // extends block_entry_matcher
      "@refuse" -> { case List(_, _, exp, _, t) =>
        TopKeywordRefuse(exp_matcher(exp), exp_matcher(t)) },
      "@show" -> { case List(_, _, exp) =>
        TopKeywordShow(exp_matcher(exp)) },
    ))

  def top_list_matcher = non_empty_list_matcher(top_entry_matcher)

  def exp: Rule = Rule(
    "exp", Map(
      "var" -> List(identifier),
      "type" -> List("type"),
      "string_t" -> List("string_t"),
      "string" -> List(double_quoted_string),
      "pi" -> List("{", non_empty_list(given_entry), "conclude", exp, "}"),
      "fn" -> List("{", non_empty_list(given_entry), "return", exp, "}"),
      "ap" -> List(exp, "(", non_empty_list(arg_entry), ")"),
      "cl" -> List("class", "{", non_empty_list(given_entry), "}"),
      "cl_predefined" -> List("class", "{", non_empty_list(define_entry), non_empty_list(given_entry), "}"),
      "cl_predefined_empty_given" -> List("class", "{", non_empty_list(define_entry), "}"),
      "cl_naked" -> List("{", non_empty_list(given_entry), "}"),
      "cl_empty" -> List("class", "{", "}"),
      "obj" -> List("object", "{", non_empty_list(let_entry), "}"),
      "obj_naked" -> List("{", non_empty_list(let_entry), "}"),
      "obj_empty" -> List("object", "{", "}"),
      "obj_naked_empty" -> List("{", "}"),
      "dot" -> List(exp, ".", identifier),
      "union" -> List("union", "{", non_empty_list(union_entry), "}"),
      "switch" -> List("switch", identifier, "{",
        non_empty_list(case_clause),
        "}"),
      "block" -> List("{", non_empty_list(block_entry), "return", exp, "}"),
    ))

  def exp_matcher: Tree => Exp = Tree.matcher[Exp](
    "exp", Map(
      "var" -> { case List(Leaf(name)) => Var(name) },
      "type" -> { case List(_) => Type() },
      "string_t" -> { case List(_) => StrType() },
      "string" -> { case List(Leaf(str)) =>
        Str(trim_double_quote(str)) },
      "pi" -> { case List(_, given_entry_list, _, return_type, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Pi(type_map, exp_matcher(return_type)) },
      "fn" -> { case List(_, given_entry_list, _, body, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Fn(type_map, exp_matcher(body)) },
      "ap" -> { case List(target, _, arg_entry_list, _) =>
        val arg_list = non_empty_list_matcher(arg_entry_matcher)(arg_entry_list)
        Ap(exp_matcher(target), arg_list) },
      "cl" -> { case List(_, _, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Cl(ListMap.empty, type_map) },
      "cl_predefined" -> { case List(
        _, _, define_entry_list, given_entry_list, _) =>
        val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Cl(defined, type_map) },
      "cl_predefined_empty_given" -> { case List(
        _, _, define_entry_list, _) =>
        val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
        Cl(defined, ListMap()) },
      "cl_naked" -> { case List(_, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Cl(ListMap.empty, type_map) },
      "cl_empty" -> { case List(_, _, _) =>
        Cl(ListMap.empty, ListMap.empty) },
      "obj" -> { case List(_, _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        Obj(value_map) },
      "obj_naked" -> { case List(_, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        Obj(value_map) },
      "obj_empty" -> { case List(_, _, _) =>
        Obj(ListMap.empty) },
      "obj_naked_empty" -> { case List(_, _) =>
        Obj(ListMap()) },
      "dot" -> { case List(target, _, Leaf(field)) =>
        Dot(exp_matcher(target), field) },
      "union" -> { case List(_, _, union_entry_list, _) =>
        Union(non_empty_list_matcher(union_entry_matcher)(union_entry_list)) },
      "switch" -> { case List(_, Leaf(name), _,
        case_clause_list,
        _) =>
        val cases = non_empty_list_matcher(case_clause_matcher)(case_clause_list)
        Switch(name, cases) },
      "block" -> { case List(_, block_entry_list, _, body, _) =>
        val block_entry_map = ListMap(non_empty_list_matcher(block_entry_matcher)(block_entry_list): _*)
        Block(block_entry_map, exp_matcher(body)) },
    ))

  def union_entry = Rule(
    "union_entry", Map(
      "case" -> List("case", exp),
    ))

  def union_entry_matcher = Tree.matcher[Exp](
    "union_entry", Map(
      "case" -> { case List(_, t) =>
        exp_matcher(t)
      },
    ))

  def case_clause = Rule(
    "case_clause", Map(
      "case" -> List("case", exp, "=", ">", exp),
    ))

  def case_clause_matcher = Tree.matcher[(Exp, Exp)](
    "case_clause", Map(
      "case" -> { case List(_, t, _, _, v) =>
        (exp_matcher(t), exp_matcher(v))
      },
    ))

  def arg_entry = Rule(
    "arg_entry", Map(
      "arg" -> List(exp),
      "arg_comma" -> List(exp, ","),
    ))

  def arg_entry_matcher = Tree.matcher[Exp](
    "arg_entry", Map(
      "arg" -> { case List(exp) => exp_matcher(exp) },
      "arg_comma" -> { case List(exp, _) => exp_matcher(exp) },
    ))

  def given_entry = Rule(
    "given_entry", Map(
      "given" -> List("given", identifier, ":", exp),
    ))

  def given_entry_matcher = Tree.matcher[(String, Exp)](
    "given_entry", Map(
      "given" -> { case List(_, Leaf(name), _, exp) => (name, exp_matcher(exp)) },
    ))

  def let_entry = Rule(
    "let_entry", Map(
      "let" -> List("let", identifier, "=", exp),
    ))

  def let_entry_matcher = Tree.matcher[(String, Exp)](
    "let_entry", Map(
      "let" -> { case List(_, Leaf(name), _, exp) =>
        (name, exp_matcher(exp)) },
    ))

  def define_entry = Rule(
    "define_entry", Map(
      "define" -> List("define", identifier, ":", exp, "=", exp),
    ))

  def define_entry_matcher = Tree.matcher[(String, (Exp, Exp))](
    "define_entry", Map(
      "define" -> { case List(_, Leaf(name), _, t, _, exp) =>
        (name, (exp_matcher(t), exp_matcher(exp))) },
    ))

  def block_entry: Rule = Rule(
    "block_entry", Map(
      "let" -> List("let", identifier, "=", exp),
      "let_cl" -> List("class", identifier, "{", non_empty_list(given_entry), "}"),
      "let_cl_empty" -> List("class", identifier, "{", "}"),
      "let_obj" -> List("object", identifier, "{", non_empty_list(let_entry), "}"),
      "let_obj_empty" -> List("object", identifier, "{", "}"),
      "let_function" -> List("function", identifier, "{",
        non_empty_list(given_entry),
        "conclude", exp,
        "return", exp,
        "}"),
      "let_function_block" -> List("function", identifier, "{",
        non_empty_list(given_entry),
        "conclude", exp,
        non_empty_list(block_entry),
        "return", exp,
        "}"),
      "define" -> List("define", identifier, ":", exp, "=", exp),
    ))

  def block_entry_matcher: Tree => (String, BlockEntry) = Tree.matcher[(String, BlockEntry)](
    "block_entry", Map(
      "let" -> { case List(_, Leaf(name), _, exp) =>
        (name, BlockEntryLet(exp_matcher(exp))) },
      "let_cl" -> { case List(_, Leaf(name), _, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        (name, BlockEntryDefine(Type(), Cl(ListMap.empty, type_map))) },
      "let_cl_empty" -> { case List(_, Leaf(name), _, _) =>
        (name, BlockEntryDefine(Type(), Cl(ListMap.empty, ListMap.empty))) },
      "let_obj" -> { case List(_, Leaf(name), _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        (name, BlockEntryLet(Obj(value_map))) },
      "let_obj_empty" -> { case List(_, Leaf(name), _, _) =>
        (name, BlockEntryLet(Obj(ListMap.empty))) },
      "let_function" -> { case List(_, Leaf(name), _,
        given_entry_list,
        _, return_type,
        _, body,
        _) =>
        val pi = Pi(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(return_type))
        val fn = Fn(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(body))
        (name, BlockEntryDefine(pi, fn)) },
      "let_function_block" -> { case List(_, Leaf(name), _,
        given_entry_list,
        _, return_type,
        block_entry_list,
        _, body,
        _) =>
        val pi = Pi(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          exp_matcher(return_type))
        val block = Block(
          ListMap(non_empty_list_matcher(block_entry_matcher)(block_entry_list): _*),
          exp_matcher(body))
        val fn = Fn(
          ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*),
          block)
        (name, BlockEntryDefine(pi, fn)) },
      "define" -> { case List(_, Leaf(name), _, t, _, exp) =>
        (name, BlockEntryDefine(exp_matcher(t), exp_matcher(exp))) },
    ))

}
