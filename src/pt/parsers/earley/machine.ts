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
