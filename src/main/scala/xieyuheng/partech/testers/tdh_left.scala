package xieyuheng.partech.testers

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object tdh_left extends PartechTester {

  val description =
    """
    tdh_left -- left regular grammar
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

  val tdh_left: () => Rule =
    () => Rule(
      "tdh_left", Map(
        "t" -> List("t"),
        "d" -> List("d"),
        "h" -> List("h"),
        "list" -> List(tdh_left_list)))

  val tdh_left_list: () => Rule =
    () => Rule(
      "tdh_left_list", Map(
        "t" -> List(tdh_left_list_head, "&", "t"),
        "d" -> List(tdh_left_list_head, "&", "d"),
        "h" -> List(tdh_left_list_head, "&", "h")))

  val tdh_left_list_head: () => Rule =
    () => Rule(
      "tdh_left_list_head", Map(
        "t" -> List("t"),
        "d" -> List("d"),
        "h" -> List("h"),
        "before_t" -> List(tdh_left_list_head, ",", "t"),
        "before_d" -> List(tdh_left_list_head, ",", "d"),
        "before_h" -> List(tdh_left_list_head, ",", "h")))

  val start = tdh_left()

  val matcher = None

}
