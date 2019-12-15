package xieyuheng.util

object pretty {

  val INDENT_UNIT: String = "  "

  def get_indent(level: Int): String = {
    assert(level >= 0)
    INDENT_UNIT * level
  }

  def add_indent_to_block(block: String, level: Int): String = {
    block
      .split("\n")
      .map(get_indent(level) ++ _)
      .mkString("\n")
  }

  def maybe_ln(string: String): String = {
    if (string.trim.isEmpty) {
      ""
    } else {
      "\n" ++ add_indent_to_block(string, 1) ++ "\n"
    }
  }

  def maybe_paren(string: String): String = {
    if (string.trim.isEmpty) {
      ""
    } else {
      "(" ++ string ++ ")"
    }
  }

  def pretty_map[A](map: Map[String, A])(fmt: ((String, A)) => String): String = {
    map.map(fmt).mkString("")
  }

  def pretty_map_with_delimiter [A](
    map: Map[String, A],
    delimiter: String,
  )(fmt: ((String, A)) => String): String = {
    map.map(fmt).mkString(delimiter)
  }

}
