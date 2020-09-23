import * as Schedule from "./schedule"
import * as Token from "../../token"
import * as Value from "../../value"

export class Machine {
  constructor(
    public tokens: Array<Token.Token>,
    public grammar: Value.Value,
    public schedule: Schedule.Schedule
  ) {}
}

export function init(
  tokens: Array<Token.Token>,
  grammar: Value.Value,
): Machine {
  return new Machine(tokens, grammar, Schedule.init(tokens, grammar))
}
