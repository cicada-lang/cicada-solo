package xieyuheng.party

import predefined._

object lexer_test extends App {

  val abc = {

    val tokens = common_lexer.lex("a b c")
    val expected = List(
      Token("a", Span(0, 1)),
      Token("b", Span(2, 3)),
      Token("c", Span(4, 5)),
    )

    assert(tokens == expected)

  }

  val flower = {

    val text = "case {   } "

    val tokens = common_lexer.lex(text)
    println(tokens)

  }



}
