import * as grammars from "./grammars"
import * as matchers from "./matchers"
import * as Piece from "../piece"
import * as pt from "../../partech"

export const parse_piece_with_souce = (source: Piece.Source.Source) =>
  pt.gen_parse({
    preprocess: pt.preprocess.erase_comment,
    lexer: pt.lexers.common,
    grammar: pt.grammar_start(grammars, "piece"),
    matcher: (tree: pt.Tree.Tree) =>
      matchers.piece_matcher_with_source(tree, source),
  })
