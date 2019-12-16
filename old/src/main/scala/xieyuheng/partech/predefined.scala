package xieyuheng.partech

import xieyuheng.partech.ruleDSL._

object predefined {

  def non_empty_list(a: Rule): Rule = Rule(
    "non_empty_list", Map(
      "one" -> List(a),
      "more" -> List(a, non_empty_list(a))),
    args = Map("a" -> a))

  def non_empty_list_matcher[A](matcher: Tree => A): Tree => List[A] = Tree.matcher(
    "non_empty_list", Map(
      "one" -> { case List(a) => List(matcher(a)) },
      "more" -> { case List(a, tail) => matcher(a) :: non_empty_list_matcher(matcher)(tail) }
    ))


  def word_in_char_set(set: Set[Char]): String => Boolean = {
    { case word => word.forall(set.contains(_)) }
  }


  def digit_char_set: Set[Char] = Set(
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9')

  def digit = WordPred("digit", word_in_char_set(digit_char_set))


  def lower_case_char_set: Set[Char] = Set(
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
  )

  def lower_case = WordPred("lower_case", word_in_char_set(lower_case_char_set))


  def upper_case_char_set: Set[Char] = Set(
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
  )

  def upper_case = WordPred("upper_case", word_in_char_set(upper_case_char_set))

  def identifier_with_preserved(
    name: String,
    preserved: List[String],
  ): WordPred = WordPred(name, { case word =>
    if (preserved.contains(word)) {
      false
    } else if (double_quoted_string.pred(word)) {
      false
    } else {
      word.headOption match {
        case Some(char) =>
          val head_set = lower_case_char_set ++ upper_case_char_set + '_'
          val tail_set = head_set ++ digit_char_set
          head_set.contains(char) && word_in_char_set(tail_set)(word.tail)
        case None => false
      }
    }
  })

  def double_quoted_string = WordPred("double_quoted_string", { case word =>
    word.length >= 2 &&
    word.head == '"' &&
    word.last == '"'
  })

  def trim_double_quote(str: String): String = {
    assert(double_quoted_string.pred(str))
    str.slice(1, str.length - 1)
  }

}
