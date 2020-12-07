import * as Piece from "../../piece"
import * as pt from "../../../partech"
import { tops_matcher, modpath_matcher } from "../matchers"

export function piece_matcher_with_source(
  tree: pt.Tree.Tree,
  source: Piece.Source.Source
): Piece.Piece {
  return pt.Tree.matcher<Piece.Piece>({
    "piece:mod": ({ modpath, tops }) =>
      Piece.create(modpath_matcher(modpath), tops_matcher(tops), source),
    "piece:repl": ({ tops }) =>
      Piece.create(undefined, tops_matcher(tops), source),
  })(tree)
}
