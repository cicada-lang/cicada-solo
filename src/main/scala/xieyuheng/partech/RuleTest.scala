package xieyuheng.partech

import xieyuheng.partech.ruleDSL._
import xieyuheng.partech.predefined._

object RuleTest extends App {

  def lexer = Lexer.default

  def preserved: List[String] = List(
    "type", "case", "fn", "pi",
  )

  def identifier = identifier_with_preserved("identifier", preserved)

  def start = exp

  def exp: Rule = Rule(
    "exp", Map(
      "type" -> List("type"),
      "var" -> List(identifier),
      "block" -> List("{", exp, "}"),
      "case" -> List(exp, "case", "{", non_empty_list(case_clause), "}"),
      "dot" -> List(exp, ".", identifier),
      "pi" -> List("pi", "(", non_empty_list(arg), ")", ":", exp),
      "fn" -> List("fn", "(", non_empty_list(arg), ")", ":", exp, "=", exp),
      "ap" -> List(exp, "(", non_empty_list(arg), ")"),
    ))

  def case_clause = Rule(
    "case_clause", Map(
      "case_clause" -> List(identifier, "=", ">", exp),
    ))

  case class Item(rule: Rule, choice_name: String, parts: List[RulePart], index: Int) {
    val matters = (rule, choice_name, parts.length, index)

    override def equals(that: Any): Boolean = {
      that match {
        case that: Item => this.matters == that.matters
        case _ => false
      }
    }

    override def hashCode = matters.hashCode

  }

  def arg = Rule(
    "arg", Map(
      "value" -> List(identifier, "=", exp),
      "type" ->  List(identifier, ":", exp),
      "value_comma" -> List(identifier, "=", exp, ","),
      "type_comma" ->  List(identifier, ":", exp, ","),
    ))

  def arg2 = Rule(
    "arg", Map(
      "value" -> List(identifier, "=", exp),
      "type" ->  List(identifier, ":", exp),
      "value_comma" -> List(identifier, "=", exp, ","),
      "type_comma" ->  List(identifier, ":", exp, ","),
    ))

  val item1 = Item(arg, "value", List(identifier, "=", exp), 0)
  val item2 = Item(arg2, "value", List(identifier, "=", exp), 0)

  assert(item1 == item2)

  import scala.collection.mutable.Set

  var itemSet: Set[Item] = Set()
  itemSet += item1
  itemSet += item2

  assert(itemSet.size == 1)
}
