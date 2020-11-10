import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Top from "../top"
import * as pt from "../../partech"

export const parse_tops = pt.gen_parse({
  grammars,
  start: "tops",
  lexer: pt.lexers.common,
  matcher: matchers.tops_matcher,
  preprocess: pt.preprocess.erase_comment,
})
