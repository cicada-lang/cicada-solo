import { Stmt } from "../stmt"
import * as grammars from "./grammars"
import * as matchers from "./matchers"
import pt from "@cicada-lang/partech"

const parse = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "stmts"),
  matcher: matchers.stmts_matcher,
})

export function parse_stmts(text: string): Array<Stmt> {
  try {
    return parse(text)
  } catch (error) {
    if (error instanceof pt.ParsingError) {
      let message = error.message
      message += "\n"
      message += pt.report(error.span, text)
      console.error(message)
    }

    throw error
  }
}
