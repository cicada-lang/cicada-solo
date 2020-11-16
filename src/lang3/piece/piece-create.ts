import * as Piece from "../piece"
import * as Top from "../top"
import * as Modpath from "../modpath"

export function create(
  modpath: Modpath.Modpath,
  tops: Array<Top.Top>,
  code: string,
  source: Piece.Source.Source
): Piece.Piece {
  return { modpath, tops, code, source }
}
