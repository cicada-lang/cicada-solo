import { Stmt } from "../stmt"
import * as grammars from "./grammars"
import * as matchers from "./matchers"
import pt from "@cicada-lang/partech"

export const parse_stmts = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "stmts"),
  matcher: matchers.stmts_matcher,
})
