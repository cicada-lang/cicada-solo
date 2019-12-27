package xieyuheng.party

import predefined._
import ruleDSL._

object earley_test extends App {

  val earley = Earley()

  val E: () => Rule =
    () => Rule("E", Map(
      "EQF" -> List(E, Q, F),
      "F" -> List(F),
    ))

  val F: () => Rule =
    () => Rule("F", Map(
      "a" -> List("a"),
    ))

  val Q: () => Rule =
    () => Rule("Q", Map(
      "+" -> List("+"),
      "-" -> List("-"),
    ))

  assert(earley.recognize(common_lexer.lex("a"), E()))
  assert(earley.recognize(common_lexer.lex("a-a+a"), E()))
  assert(!earley.recognize(common_lexer.lex("a-a+b"), E()))
  assert(!earley.recognize(common_lexer.lex("a-a++"), E()))

  testers.ab.test(earley)
  testers.exp.test(earley)
  testers.sexp.test(earley)
  testers.tdh.test(earley)
  testers.tdh_left.test(earley)
  testers.tom_dick_and_harry.test(earley)

}
