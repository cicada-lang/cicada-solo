import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Exp from "../exp"
import * as Top from "../top"
import * as pt from "../../partech"
import * as ut from "../../ut"

export function parse_tops(text: string): Array<Top.Top> {
  const mod = pt.Mod.from_present(grammars)
  const grammar = pt.Mod.dot(mod, "tops")
  const parser = pt.EarleyParser.create(grammar)
  const lexer = pt.lexers.common
  const processed_text = pt.preprocess.erase_comment(text)
  const tokens =
    processed_text.trim().length === 0 ? [] : lexer.lex(processed_text)
  const tree = parser.parse(tokens)
  const tops = matchers.tops_matcher(tree)
  return tops
}
