package xieyuheng.cicada

import xieyuheng.util.mini_interpreter

import xieyuheng.partech.Parser

object cicada extends mini_interpreter (
  "cicada", "0.0.1", { case code =>
    Parser(grammar.lexer, grammar.top_list).parse(code) match {
      case Right(tree) =>
        val top_list = grammar.top_list_matcher(tree)
        api.run(top_list) match {
          case Right(_ok) =>
          // do nothing
          case Left(err) =>
            println(s"${err.msg}")
            System.exit(1)
        }
      case Left(error) =>
        println(s"[parse_error] ${error.msg}")
        System.exit(1)
    }
  }
)
