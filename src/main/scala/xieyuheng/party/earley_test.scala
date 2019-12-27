package xieyuheng.party

import predefined._

object earley_test extends App {

  val earley = Earley()

  val a_test_from_the_book_parsing_techniques = {

    def E(): Rule = Rule("E", Map(
      "EQF" -> List(SymbolFn(E), SymbolFn(Q), SymbolFn(F)),
      "F" -> List(SymbolFn(F)),
    ))

    def F(): Rule = Rule("F", Map(
      "a" -> List(SymbolWord("a")),
    ))

    def Q(): Rule = Rule("Q", Map(
      "+" -> List(SymbolWord("+")),
      "-" -> List(SymbolWord("-")),
    ))

    assert(earley.recognize(common_lexer.lex("a"), E()))
    assert(earley.recognize(common_lexer.lex("a-a+a"), E()))
    assert(!earley.recognize(common_lexer.lex("a-a+b"), E()))
    assert(!earley.recognize(common_lexer.lex("a-a++"), E()))

  }

  testers.ab.test(earley)
  // testers.exp.test(earley)
  // testers.sexp.test(earley)
  // testers.tdh.test(earley)
  // testers.tdh_left.test(earley)
  // testers.tom_dick_and_harry.test(earley)
}
