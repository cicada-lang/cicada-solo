package xieyuheng.partech

import xieyuheng.partech.example._

object tree_matcher_test extends App {
  def test(ex: ExampleRule): Unit = {
    val rule = ex.start
    val lexer = ex.lexer

    ex.sentences.foreach { case text =>
      Parser(lexer, rule).parse(text) match {
        case Right(tree) =>
          ex.matcher match {
            case Some(matcher) => println(matcher(tree))
            case None => {}
          }
        case Left(error) =>
          println(s"[treeMatcherTest]")
          println(s"- rule: ${rule.name}")
          println(s"- text: ${text}")
          println(s"- error: ${error}")
          throw new Exception()
      }
    }
  }

  test(ab)
  test(sexp)
}
