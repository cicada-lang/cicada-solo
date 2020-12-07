import * as Source from "./source"
import * as Modpath from "../modpath"
import * as Top from "../top"

export type Piece = {
  modpath?: Modpath.Modpath
  tops: Array<Top.Top>
  source: Source.Source
}
