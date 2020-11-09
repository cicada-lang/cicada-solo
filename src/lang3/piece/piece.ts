import * as Source from "./source"
import * as Top from "../top"

export interface Piece {
  name: string
  imports: Array<{ name: string; alias?: string }>
  tops: Array<Top.Top>
  code: string
  source: Source.Source
}
