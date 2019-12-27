package xieyuheng.partech.testers

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object tdh extends PartechTester {

  val description =
    """
    tdh -- left regular grammar
    """

  val lexer = common_lexer

  val sentences =
    List(
      "t,d&h",
    )

  val non_sentences =
    List(
      "t,d,h",
    )

  val tdh: () => Rule =
    () => Rule(
      "tdh", Map(
        "t" -> List("t"),
        "d" -> List("d"),
        "h" -> List("h"),
        "tdh_list" -> List(tdh_list)))

  val tdh_list: () => Rule =
    () => Rule(
      "tdh_list", Map(
        "t" -> List("t", tdh_list_tail),
        "d" -> List("d", tdh_list_tail),
        "h" -> List("h", tdh_list_tail)))

  val tdh_list_tail: () => Rule =
    () => Rule(
      "tdh_list_tail", Map(
        "list" -> List(",", tdh_list),
        "t" -> List("&", "t"),
        "d" -> List("&", "d"),
        "h" -> List("&", "h")))

  val start = tdh()

  val matcher = None

}
