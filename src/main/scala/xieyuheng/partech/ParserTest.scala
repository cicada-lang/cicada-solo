package xieyuheng.partech

import xieyuheng.partech.pretty._
import xieyuheng.partech.example._

object ParserTest extends App {
  def test(ex: ExampleRule): Unit = {
    val rule = ex.start
    val lexer = ex.lexer

    ex.sentences.foreach { case text =>
      Parser(lexer, rule).parse(text) match {
        case Right(tree) => {}
        case Left(error) =>
          println(s"[ParserTest] should parse")
          println(s"- rule: ${rule.name}")
          println(s"- text: ${text}")
          println(s"- error: ${error}")
          throw new Exception()
      }
    }

    ex.non_sentences.foreach { case text =>
      Parser(lexer, rule).parse(text) match {
        case Right(tree) =>
          println(s"[ParserTest] should not parse")
          println(s"- rule: ${rule.name}")
          println(s"- text: ${text}")
          println(s"- tree: ${pretty_tree(tree)}")
          throw new Exception()
        case Left(error) => {}
      }
    }
  }

  test(exp)
  test(sexp)
  test(tdh)
  test(tdh_left)
  test(tom_dick_and_harry)
  test(ab)
}
