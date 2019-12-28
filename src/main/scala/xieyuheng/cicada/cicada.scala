package xieyuheng.cicada

import collection.immutable.ListMap

import xieyuheng.util.Interpreter
import xieyuheng.partech.Parser
import xieyuheng.partech.Earley
import xieyuheng.partech.ErrorDuringParsing

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
    try {
      val tree = parser.parse(code)
      val top_list = grammar.top_list_matcher(tree)
      api.run(top_list, this.config)
    } catch {
      case error: ErrorDuringParsing =>
        println(s"parsing error, at span: (${error.span.lo}, ${error.span.hi})")
        println(s"${error.message}")
        System.exit(1)
    }
  }

}
