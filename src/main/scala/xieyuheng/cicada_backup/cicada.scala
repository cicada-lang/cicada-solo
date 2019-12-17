package xieyuheng.cicada_backup

import xieyuheng.util.mini_interpreter

import xieyuheng.partech.Parser

object cicada_backup extends mini_interpreter (
  "cicada_backup", "0.0.1", { case code =>
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
