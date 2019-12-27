package xieyuheng.party.testers

import xieyuheng.party._
import xieyuheng.party.ruleDSL._
import xieyuheng.party.predefined._

object exp extends PartechTester {

  val description =
    """
    expressions with `dot` and `case`
    """

  val lexer = common_lexer

  val sentences =
    List(
      "type",
      "n",
      "x.prev",
      "succ_t(prev = nat_add(x = x.prev, y = y))",

      """
      case {
      }
      """,

      """
      x case {
        zero_t => y
        succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
      }
      """,

      """
      x case {
        zero_t => y
        succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
          zero_t => y
          succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
        }))
      }
      """,

      """
      x case {
        zero_t => x case {
           zero_t => y
           succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
             zero_t => y
             succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
           }))
         }
        succ_t => succ_t(prev = nat_add(x = x.prev, y = x case {
          zero_t => y
          succ_t => succ_t(prev = nat_add(x = x.prev, y = y))
        }))
      }
      """,
    )

  val non_sentences =
    List(
      "case",
      "x..y",
      "x...y",
    )

  val preserved: List[String] =
    List(
      "type",
      "case",
    )

  val identifier: WordPred =
    identifier_with_preserved("identifier", preserved)

  val exp: () => Rule =
    () => Rule(
      "exp", Map(
        "type" -> List("type"),
        "var" -> List(identifier),
        "case_empty" -> List("case", "{", "}"),
        "case" -> List(exp, "case", "{", $(non_empty_list, case_clause), "}"),
        "dot" -> List(exp, ".", identifier),
        "ap" -> List(exp, "(", $(non_empty_list, arg), ")"),
      ))

  val case_clause =
    () => Rule(
      "case_clause", Map(
        "case_clause" -> List(identifier, "=", ">", exp),
      ))

  val arg =
    () => Rule(
      "arg", Map(
        "value" -> List(identifier, "=", exp),
        "type" ->  List(identifier, ":", exp),
        "value_comma" -> List(identifier, "=", exp, ","),
        "type_comma" ->  List(identifier, ":", exp, ","),
      ))

  val start = exp()

  val matcher = None

}
