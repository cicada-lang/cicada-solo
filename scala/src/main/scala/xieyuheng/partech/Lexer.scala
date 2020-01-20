package xieyuheng.partech

case class Lexer(
  word_matcher: String => Option[(String, String)],
  ignorer: String => String,
) {

  def lex(text: String): List[Token] = {
    var remain = text
    var tokens: List[Token] = List()
    while (remain.length > 0) {
      remain = this.ignorer(remain)
      if (remain.length > 0) {
        this.word_matcher(remain) match {
          case Some((left, right)) =>
            val hi = text.length - right.length
            val lo = hi - left.length
            tokens = tokens :+ Token(left, Span(lo, hi))
            remain = right
          case None =>
            val hi = text.length
            val lo = text.length - remain.length
            throw ErrorDuringParsing(
              s"lexer fail\n" +
                s"word_matcher: ${word_matcher} matches nothing.",
              Span(lo, hi))
        }
      }
    }
    tokens
  }

}
