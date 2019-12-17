package xieyuheng.partech.example

import xieyuheng.partech._
import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object tom_dick_and_harry extends ExampleRule {

  def lexer = Lexer.default

  val sentences = List(
    "tom, dick and harry",
  )

  val non_sentences = List(
    "tom, dick, harry",
  )

  def start = tom_dick_and_harry

  def matcher = None

  def tom_dick_and_harry = Rule(
    "tom_dick_and_harry", Map(
      "name" -> List(name),
      "list" -> List(name_list, "and", name)))

  def name = Rule(
    "name", Map(
      "tom" -> List("tom"),
      "dick" -> List("dick"),
      "harry" -> List("harry")))

  def name_list = non_empty_list(
    Rule("name_list_entry", Map(
      "name_alone" -> List(name),
      "name_comma" -> List(name, ","),
    )))

}
