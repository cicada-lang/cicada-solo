package xieyuheng.cicada

import xieyuheng.util.mini_interpreter

import xieyuheng.partech.Parser

object cicada extends mini_interpreter (
  "cicada", "0.0.1", { case code =>
    Parser(grammar.lexer, grammar.top_list).parse(code) match {
      case Right(tree) =>
        val top_list = grammar.top_list_matcher(tree)
        try {
          api.run(top_list)
        } catch {
          case report: Report =>
            report.print()
            System.exit(1)
        }
      case Left(error) =>
        println(s"[parse_error] ${error.msg}")
        System.exit(1)
    }
  }
)
