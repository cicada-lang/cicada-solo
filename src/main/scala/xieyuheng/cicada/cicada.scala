package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import xieyuheng.util.Interpreter
import xieyuheng.party.Parser
import xieyuheng.party.Earley
import xieyuheng.party.ErrorDuringParsing

object cicada extends Interpreter {

  val name = "cicada"
  val version = "0.0.1"

  val config_declaration = ListMap(
    "--verbose" -> 0,
    "--nocolor" -> 0,
  )

  def run_code(code: String): Unit = {
    val earley = Earley()
    val parser = Parser(grammar.lexer, grammar.top_list, earley)
    Try {
      parser.parse(code)
    } match {
      case Success(tree) =>
        val top_list = grammar.top_list_matcher(tree)
        api.run(top_list, this.config)
      case Failure(error: ErrorDuringParsing) =>
        println(s"[parse_error] ${error.message}")
        System.exit(1)
      case Failure(error) =>
        println(s"error: ${error}")
        System.exit(1)
    }
  }

}
