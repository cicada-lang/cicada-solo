package xieyuheng.partech

import scala.util.{ Try, Success, Failure }

case class LexTable(
  word_matcher: String => Option[(String, String)],
  ignorer: String => String)

case class Span(lo: Int, hi: Int)

case class Word(str: String, span: Span) {
  override def toString: String = {
    val doublequote = '"'
    s"${doublequote}${str}${doublequote} [${span.lo}, ${span.hi}]"
  }
}

case class Lexer(table: LexTable) {

  def lex(text: String): Either[ErrMsg, List[Word]] = {
    var remain: String = text
    var tokens: List[Word] = List()
    Try {
      while (remain.length > 0) {
        remain = table.ignorer(remain)
        if (remain.length > 0) {
          table.word_matcher(remain) match {
            case Some((left, right)) =>
              val hi = text.length - right.length
              val lo = hi - left.length
              tokens = tokens :+ Word(left, Span(lo, hi))
              remain = right
            case None =>
              val hi = text.length
              val lo = text.length - remain.length
              throw ErrMsg("Lexer", s"", Span(lo, hi))
          }
        }
      }
    } match {
      case Success(()) =>
        Right(tokens)
      case Failure(err: ErrMsg) =>
        Left(err)
      case Failure(err) =>
        throw err
    }
  }

}

object Lexer {

  val space_char_set = Set(' ', '\n', '\t')

  def ignore_one_space(text: String): Option[String] = {
    text.headOption match {
      case Some(char) =>
        if (space_char_set.contains(char)) {
          Some(text.tail)
        } else {
          None
        }
      case _ => None
    }
  }

  def ignore_one_line_comment(text: String): Option[String] = {
    if (text.startsWith("//")) {
      text.indexOf('\n') match {
        case -1 =>
          // ignore all text
          Some("")
        case i =>
          val (_, remain) = text.splitAt(i)
          Some(remain)
      }
    } else {
      None
    }
  }

  def ignore_space_and_line_comment(text: String): String = {
    var remain: String = text
    var continue: Boolean = true
    while (continue) {
      ignore_one_space(remain) match {
        case Some(str) => remain = str
        case None => ignore_one_line_comment(remain) match {
          case Some(str) => remain = str
          case None => continue = false
        }
      }
    }
    remain
  }

  val symbol_char_set = Set(
    '=', ':', '.',
    ',', ';',

    '~', '!', '@', '#', '$', '%', '^', '&', '*',  '-', '+',

    '<', '>',
    '(', ')',
    '[', ']',
    '{', '}',
  )

  def word_matcher(text: String): Option[(String, String)] = {
    text.headOption match {
      case Some(char) =>
        if (symbol_char_set.contains(char)) {
          Some((char.toString, text.tail))
        } else {
          text.find { case char =>
            space_char_set.contains(char) ||
            symbol_char_set.contains(char)
          } match {
            case Some(char) =>
              val i = text.indexOf(char)
              Some(text.splitAt(i))
            case None =>
              Some((text, ""))
          }
        }
      case None => None
    }
  }

  def word_matcher_with_string(text: String): Option[(String, String)] = {
    text.headOption match {
      case Some(char) =>
        if (symbol_char_set.contains(char)) {
          Some((char.toString, text.tail))
        } else if (char == '"') {
          val i = text.indexOf('"', 1)
          if (i == -1) {
            // doublequote mismatch
            None
          } else {
            Some(text.splitAt(i + 1))
          }
        } else {
          text.find { case char =>
            space_char_set.contains(char) ||
            symbol_char_set.contains(char)
          } match {
            case Some(char) =>
              val i = text.indexOf(char)
              Some(text.splitAt(i))
            case None =>
              Some((text, ""))
          }
        }
      case None => None
    }
  }

  def default = Lexer(LexTable(
    word_matcher_with_string,
    ignore_space_and_line_comment,
  ))

}
