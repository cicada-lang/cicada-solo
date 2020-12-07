import * as Piece from "../piece"
import * as Top from "../top"
import * as Modpath from "../modpath"

export function create(
  modpath: undefined | Modpath.Modpath,
  tops: Array<Top.Top>,
  source: Piece.Source.Source
): Piece.Piece {
  return { modpath, tops, source }
}
