package xieyuheng.partech.example

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object ab extends ExampleRule {

  // equal number of "a" "b"

  val lexer = Lexer.default

  val sentences = List(
    "a b",
    "a b a b",
    "a a b b",
  )

  val non_sentences = List(
    "a a b",
  )

  def start = ab

  def matcher = Some(ab_matcher)

  def ab = Rule(
    "ab", Map(
      "head_a" -> List("a", b),
      "head_b" -> List("b", a)))

  def ab_matcher = Tree.matcher[AB](
    "ab", Map(
      "head_a" -> { case List(_, b) => HEAD_A(b_matcher(b)) },
      "head_b" -> { case List(_, a) => HEAD_B(a_matcher(a)) },
    ))

  def a: Rule = Rule(
    "a", Map(
      "one_a" -> List("a"),
      "more_a" -> List("a", ab),
      "after_b" -> List("b", a, a)))

  def a_matcher: Tree => A = Tree.matcher[A](
    "a", Map(
      "one_a" -> { _ => ONE_A() },
      "more_a" -> { case List(_, ab) => MORE_A(ab_matcher(ab)) },
      "after_b" -> { case List(_, a1, a2) => AFTER_B(a_matcher(a1), a_matcher(a2)) },
    ))

  def b: Rule = Rule(
    "b", Map(
      "one_b" -> List("b"),
      "more_b" -> List("b", ab),
      "after_a" -> List("a", b, b)))

  def b_matcher: Tree => B = Tree.matcher[B](
    "b", Map(
      "one_b" -> { case _ => ONE_B() },
      "more_b" -> { case List(_, ab) => MORE_B(ab_matcher(ab)) },
      "after_a" -> { case List(_, b1, b2) => AFTER_A(b_matcher(b1), b_matcher(b2)) },
    ))

  sealed trait AB
  final case class HEAD_A(b: B) extends AB
  final case class HEAD_B(a: A) extends AB

  sealed trait A
  final case class ONE_A() extends A
  final case class MORE_A(ab: AB) extends A
  final case class AFTER_B(a1: A, a2: A) extends A

  sealed trait B
  final case class ONE_B() extends B
  final case class MORE_B(ab: AB) extends B
  final case class AFTER_A(b1: B, b2: B) extends B
}
