import * as Source from "./source"
import * as Top from "../top"

export interface Piece {
  modpath: string
  imports: Array<{ modpath: string; alias?: string }>
  tops: Array<Top.Top>
  code: string
  source: Source.Source
}
