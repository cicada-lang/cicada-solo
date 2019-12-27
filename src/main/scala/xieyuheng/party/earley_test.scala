package xieyuheng.party

import predefined._

object earley_test extends App {

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

  val earley = Earley()

  assert(earley.recognize(common_lexer.lex("a"), E()))
  assert(earley.recognize(common_lexer.lex("a-a+a"), E()))
  assert(!earley.recognize(common_lexer.lex("a-a+b"), E()))
  assert(!earley.recognize(common_lexer.lex("a-a++"), E()))

}
