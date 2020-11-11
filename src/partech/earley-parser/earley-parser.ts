import * as Parser from "../parser"
import * as Token from "../token"
import * as Schedule from "./schedule"

export type EarleyParser = Parser.Parser & {
  recognize(tokens: Array<Token.Token>): boolean
  opts: Schedule.Opts
}
