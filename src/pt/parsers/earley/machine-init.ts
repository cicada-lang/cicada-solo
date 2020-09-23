import * as Machine from "./machine"
import * as Schedule from "./schedule"
import * as Token from "../../token"
import * as Value from "../../value"

export function init(
  tokens: Array<Token.Token>,
  grammar: Value.Value
): Machine.Machine {
  return new Machine.Machine(tokens, grammar, Schedule.init(tokens, grammar))
}
