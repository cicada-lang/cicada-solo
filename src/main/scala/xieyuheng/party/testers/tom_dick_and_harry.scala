package xieyuheng.party.testers

import xieyuheng.party._
import xieyuheng.party.ruleDSL._
import xieyuheng.party.predefined._

object tom_dick_and_harry extends PartechTester {

  val description =
    """
    tom_dick_and_harry
    """

  val lexer = common_lexer

  val sentences =
    List(
      "tom, dick and harry",
    )

  val non_sentences =
    List(
      "tom, dick, harry",
    )

  val tom_dick_and_harry: () => Rule =
    () => Rule(
      "tom_dick_and_harry", Map(
        "name" -> List(name),
        "list" -> List($(non_empty_list, name_list_entry), "and", name)))

  val name: () => Rule =
    () => Rule(
      "name", Map(
        "tom" -> List("tom"),
        "dick" -> List("dick"),
        "harry" -> List("harry")))

  val name_list_entry: () => Rule =
    () => Rule(
      "name_list_entry", Map(
        "name_alone" -> List(name),
        "name_comma" -> List(name, ","),
      ))

  val start = tom_dick_and_harry()

  val matcher = None

}
