package xieyuheng.cicada

import collection.immutable.ListMap

import xieyuheng.util.Interpreter
import xieyuheng.partech.Parser

object cicada extends Interpreter {

  val name = "cicada"
  val version = "0.0.1"

  val config_declaration = ListMap(
    "--verbose" -> 0,
    "--nocolor" -> 0,
  )

  def run_code(code: String): Unit = {
    Parser(grammar.lexer, grammar.top_list).parse(code) match {
      case Right(tree) =>
        val top_list = grammar.top_list_matcher(tree)
        api.run(top_list, this.config)
      case Left(error) =>
        println(s"[parse_error] ${error.message}")
        System.exit(1)
    }
  }

}
