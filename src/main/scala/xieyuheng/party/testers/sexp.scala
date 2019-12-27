package xieyuheng.party.testers

import xieyuheng.party._
import xieyuheng.party.ruleDSL._
import xieyuheng.party.predefined._

object sexp extends PartechTester {

  val description =
    """
    sexp
    """

  val lexer = common_lexer

  val sentences =
    List(
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

  val non_sentences =
    List(
      "(",
      "())",
      "true [false]",
      "true false",
    )

  val identifier = identifier_with_preserved("identifier", List())

  val sexp: () => Rule =
    () => Rule(
      "sexp", Map(
        "null" -> List("(", ")"),
        "atom" -> List(identifier),
        "sexp_list" -> List("(", $(non_empty_list, sexp), ")"),
      ))

  sealed trait Sexp
  final case object NullSexp extends Sexp
  final case class AtomSexp(str: String) extends Sexp
  final case class ConsSexp(car: Sexp, cdr: Sexp) extends Sexp

  val sexp_matcher: Tree => Sexp =
    Tree.matcher[Sexp](
      "sexp", Map(
        "null" -> { case _ => NullSexp },
        "atom" -> { case List(Leaf(token)) => AtomSexp(token.word) },
        "sexp_list" -> { case List(_, list, _) =>
          val init: Sexp = NullSexp
          non_empty_list_matcher(sexp_matcher)(list)
            .foldRight(init) { case (car, sexp) => ConsSexp(car, sexp) } }
      ))

  val start = sexp()

  val matcher = Some(sexp_matcher)

}
