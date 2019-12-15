package xieyuheng.partech.example

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object tdh_left extends ExampleRule {

  // left regular grammar

  def lexer = Lexer.default

  def sentences = List(
    "t,d&h",
  )

  def non_sentences = List(
    "t,d,h",
  )

  def start = tdh_left

  def matcher = None

  def tdh_left = Rule(
    "tdh_left", Map(
      "t" -> List("t"),
      "d" -> List("d"),
      "h" -> List("h"),
      "list" -> List(tdh_left_list)))

  def tdh_left_list = Rule(
    "tdh_left_list", Map(
      "t" -> List(tdh_left_list_head, "&", "t"),
      "d" -> List(tdh_left_list_head, "&", "d"),
      "h" -> List(tdh_left_list_head, "&", "h")))

  def tdh_left_list_head: Rule = Rule(
    "tdh_left_list_head", Map(
      "t" -> List("t"),
      "d" -> List("d"),
      "h" -> List("h"),
      "before_t" -> List(tdh_left_list_head, ",", "t"),
      "before_d" -> List(tdh_left_list_head, ",", "d"),
      "before_h" -> List(tdh_left_list_head, ",", "h")))

}
