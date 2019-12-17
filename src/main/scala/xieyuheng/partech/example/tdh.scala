package xieyuheng.partech.example

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object tdh extends ExampleRule {

  // regular grammar

  def lexer = Lexer.default

  def sentences = List(
    "t,d&h",
  )

  def non_sentences = List(
    "t,d,h",
  )

  def start = tdh

  def matcher = None

  def tdh = Rule(
    "tdh", Map(
      "t" -> List("t"),
      "d" -> List("d"),
      "h" -> List("h"),
      "tdh_list" -> List(tdh_list)))

  def tdh_list = Rule(
    "tdh_list", Map(
      "t" -> List("t", tdh_list_tail),
      "d" -> List("d", tdh_list_tail),
      "h" -> List("h", tdh_list_tail)))

  def tdh_list_tail: Rule = Rule(
    "tdh_list_tail", Map(
      "list" -> List(",", tdh_list),
      "t" -> List("&", "t"),
      "d" -> List("&", "d"),
      "h" -> List("&", "h")))

}
