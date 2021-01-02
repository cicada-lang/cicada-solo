import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Decl from "../decl"
import * as pt from "../../partech"

export const parse_decls = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "decls"),
  matcher: matchers.decls_matcher,
})
