import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Top from "../top"
import * as pt from "../../partech"

export const parse_tops = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "tops"),
  matcher: matchers.tops_matcher,
})
