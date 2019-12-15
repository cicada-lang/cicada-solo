package xieyuheng.partech

case class Parser(lexer: Lexer, rule: Rule) {
  def parse(text: String): Either[ErrMsg, Tree] = {
    lexer.lex(text).flatMap { case words =>
      val parsing = Earley.init(words, rule)
      parsing.parse()
    }
  }
}
