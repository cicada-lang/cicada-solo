package xieyuheng.party

object predefined {

  val non_empty_list: List[Symbol] => Rule = {
    case args =>
      Rule("non_empty_list", Map(
        "one" -> List(args(0)),
        "more" -> List(args(0), SymbolAp(non_empty_list, args)),
      ))
  }

  val space_char_set = Set(' ', '\n', '\t')

  val punctuation_char_set = Set(
    '=', ':', '.',
    ',', ';',
    '~', '!', '@', '#', '$', '%', '^', '&', '*',  '-', '+',
    '<', '>',
    '(', ')',
    '[', ']',
    '{', '}',
  )

  def ignore_one_space(text: String): Option[String] = {
    if (text.length == 0) {
      None
    } else {
      val head = text(0)
      if (space_char_set.contains(head)) {
        Some(text.substring(1))
      } else {
        None
      }
    }
  }

  def ignore_one_line_comment(text: String): Option[String] = {
    if (text.startsWith("//")) {
      val i = text.indexOf('\n')
      if (i == -1) {
        Some("")
      } else {
        Some(text.substring(i))
      }
    } else {
      None
    }
  }

  def ignore_space_and_line_comment(text: String): String = {
    var remain = text
    var continue_p = true
    while (continue_p) {
      ignore_one_space(remain) match {
        case Some(str) =>
          remain = str
        case None =>
          ignore_one_line_comment(remain) match {
            case Some(str) =>
              remain = str
            case None =>
              continue_p = false
          }
      }
    }
    remain
  }

  def word_matcher(text: String): Option[(String, String)] = {
    if (text.length == 0) {
      None
    } else {
      val head = text(0)
      if (punctuation_char_set.contains(head)) {
        Some((head.toString, text.substring(1)))
      } else {
        val i = text.indexWhere {
          case x =>
            space_char_set.contains(x) ||
            punctuation_char_set.contains(x)
        }
        if (i != -1) {
          Some((text.substring(0, i), text.substring(i)))
        } else {
          Some((text, ""))
        }
      }
    }
  }

  def word_matcher_with_string(text: String): Option[(String, String)] = {
    if (text.length == 0) {
      None
    } else {
      val head = text(0)
      if (punctuation_char_set.contains(head)) {
        Some((head.toString, text.substring(1)))
      } else if (head == '"') {
        val i = text.indexOf('"', 1)
        if (i == -1) {
          // doublequote mismatch
          None
        } else {
          Some((text.substring(0, i + 1), text.substring(i + 1)))
        }
      } else {
        val i = text.indexWhere {
          case x =>
            space_char_set.contains(x) ||
            punctuation_char_set.contains(x)
        }
        if (i != -1) {
          Some((text.substring(0, i), text.substring(i)))
        } else {
          Some((text, ""))
        }
      }
    }
  }

  val common_lexer = Lexer(
    word_matcher = word_matcher_with_string,
    ignorer = ignore_space_and_line_comment,
  )

}
