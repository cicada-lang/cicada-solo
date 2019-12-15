package xieyuheng.partech.example

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object sexp extends ExampleRule {

  def lexer = Lexer.default

  def sentences = List(
    "()",
    "( )",
    "(a b c)",
    "n",
    "(a b (c))",
    "(((a)) b (c))",
    "(true false)",
    "(true false true)",
    "(true ((((false)))))",
    "( true false)",
    "(true false true )",
    "(true ((( (false)))))",
  )

  def non_sentences = List(
    "(",
    "())",
    "true [false]",
    "true false",
  )

  def identifier = identifier_with_preserved("identifier", List())

  def start = sexp

  def matcher = Some(sexp_matcher)

  def sexp: Rule = Rule(
    "sexp", Map(
      "null" -> List("(", ")"),
      "atom" -> List(identifier),
      "sexp_list" -> List("(", non_empty_list(sexp), ")"),
    ))


  def sexp_matcher: Tree => Sexp = Tree.matcher[Sexp](
    "sexp", Map(
      "null" -> { case _ => NullSexp },
      "atom" -> { case List(Leaf(str)) => AtomSexp(str) },
      "sexp_list" -> { case List(_, list, _) =>
        val init: Sexp = NullSexp
        non_empty_list_matcher(sexp_matcher)(list)
          .foldRight(init) { case (car, sexp) => ConsSexp(car, sexp) } }
    ))


  sealed trait Sexp
  final case object NullSexp extends Sexp
  final case class AtomSexp(str: String) extends Sexp
  final case class ConsSexp(car: Sexp, cdr: Sexp) extends Sexp
}
