package xieyuheng.cicada

import collection.immutable.ListMap

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object grammar {

  val lexer = Lexer.default

  def preserved: List[String] = List(
    "type",
    "class",
    "claim", "define",
    "given", "conclude",
    "let", "return",
  )

  def identifier = identifier_with_preserved("identifier", preserved)

  def top_list = non_empty_list(top_entry)

  def top_entry = Rule(
    "top_entry", Map(
      "let" -> List("let", identifier, "=", exp),
      "define_cl" -> List("class", identifier, "{", non_empty_list(given_entry), "}"),
      "define_cl_empty" -> List("class", identifier, "{", "}"),
      "let_obj" -> List("object", identifier, "{", non_empty_list(let_entry), "}"),
      "let_obj_empty" -> List("object", identifier, "{", "}"),
      "define" -> List("define", identifier, ":", exp, "=", exp),
      "@refuse" -> List("@", "refuse", identifier, ":", exp, "=", exp),
    ))

  def top_entry_matcher = Tree.matcher[Top](
    "top_entry", Map(
      "let" -> { case List(_, Leaf(name), _, exp) =>
        TopLet(name, exp_matcher(exp)) },
      "define_cl" -> { case List(_, Leaf(name), _, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        TopDefine(name, Type(), Cl(type_map)) },
      "define_cl_empty" -> { case List(_, Leaf(name), _, _) =>
        TopDefine(name, Type(), Cl(ListMap.empty)) },
      "let_obj" -> { case List(_, Leaf(name), _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        TopLet(name, Obj(value_map)) },
      "let_obj_empty" -> { case List(_, Leaf(name), _, _) =>
        TopLet(name, Obj(ListMap.empty)) },
      "define" -> { case List(_, Leaf(name), _, t, _, exp) =>
        TopDefine(name, exp_matcher(t), exp_matcher(exp)) },
      "@refuse" -> { case List(_, _, Leaf(name), _, t, _, exp) =>
        TopKeywordRefuse(name, exp_matcher(t), exp_matcher(exp)) },
    ))

  def top_list_matcher = non_empty_list_matcher(top_entry_matcher)

  def exp: Rule = Rule(
    "exp", Map(
      "var" -> List(identifier),
      "type" -> List("type"),
      "pi" -> List("{", non_empty_list(given_entry), "conclude", exp, "}"),
      "fn" -> List("{", non_empty_list(given_entry), "return", exp, "}"),
      "ap" -> List(exp, "(", non_empty_list(arg_entry), ")"),
      "cl" -> List("class", "{", non_empty_list(given_entry), "}"),
      "cl_predefined" -> List("class", "{", non_empty_list(define_entry), non_empty_list(given_entry), "}"),
      "cl_naked" -> List("{", non_empty_list(given_entry), "}"),
      "cl_empty" -> List("class", "{", "}"),
      "obj" -> List("object", "{", non_empty_list(let_entry), "}"),
      "obj_naked" -> List("{", non_empty_list(let_entry), "}"),
      "obj_empty" -> List("object", "{", "}"),
      "obj_naked_empty" -> List("{", "}"),
      "dot" -> List(exp, ".", identifier),
      "block" -> List("{", non_empty_list(block_entry), "return", exp, "}"),
    ))

  def exp_matcher: Tree => Exp = Tree.matcher[Exp](
    "exp", Map(
      "var" -> { case List(Leaf(name)) => Var(name) },
      "type" -> { case List(_) => Type() },
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
        Cl(type_map) },
      "cl_predefined" -> { case List(
        _, _, define_entry_list, given_entry_list, _) =>
        val defined = ListMap(non_empty_list_matcher(define_entry_matcher)(define_entry_list): _*)
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        ClPredefined(defined, type_map) },
      "cl_naked" -> { case List(_, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        Cl(type_map) },
      "cl_empty" -> { case List(_, _, _) =>
        Cl(ListMap()) },
      "obj" -> { case List(_, _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        Obj(value_map) },
      "obj_naked" -> { case List(_, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        Obj(value_map) },
      "obj_empty" -> { case List(_, _, _) =>
        Obj(ListMap()) },
      "obj_naked_empty" -> { case List(_, _) =>
        Obj(ListMap()) },
      "dot" -> { case List(target, _, Leaf(field)) =>
        Dot(exp_matcher(target), field) },
      "block" -> { case List(_, block_entry_list, _, body, _) =>
        val block_entry_map = ListMap(non_empty_list_matcher(block_entry_matcher)(block_entry_list): _*)
        Block(block_entry_map, exp_matcher(body)) },
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

  def block_entry = Rule(
    "block_entry", Map(
      "let" -> List("let", identifier, "=", exp),
      "define_cl" -> List("class", identifier, "{", non_empty_list(given_entry), "}"),
      "define_cl_empty" -> List("class", identifier, "{", "}"),
      "let_obj" -> List("object", identifier, "{", non_empty_list(let_entry), "}"),
      "let_obj_empty" -> List("object", identifier, "{", "}"),
      "define" -> List("define", identifier, ":", exp, "=", exp),
    ))

  def block_entry_matcher = Tree.matcher[(String, BlockEntry)](
    "block_entry", Map(
      "let" -> { case List(_, Leaf(name), _, exp) =>
        (name, BlockEntryLet(exp_matcher(exp))) },
      "define_cl" -> { case List(_, Leaf(name), _, given_entry_list, _) =>
        val type_map = ListMap(non_empty_list_matcher(given_entry_matcher)(given_entry_list): _*)
        (name, BlockEntryDefine(Type(), Cl(type_map))) },
      "define_cl_empty" -> { case List(_, Leaf(name), _, _) =>
        (name, BlockEntryDefine(Type(), Cl(ListMap.empty))) },
      "let_obj" -> { case List(_, Leaf(name), _, let_entry_list, _) =>
        val value_map = ListMap(non_empty_list_matcher(let_entry_matcher)(let_entry_list): _*)
        (name, BlockEntryLet(Obj(value_map))) },
      "let_obj_empty" -> { case List(_, Leaf(name), _, _) =>
        (name, BlockEntryLet(Obj(ListMap.empty))) },
      "define" -> { case List(_, Leaf(name), _, t, _, exp) =>
        (name, BlockEntryDefine(exp_matcher(t), exp_matcher(exp))) },
    ))

}
