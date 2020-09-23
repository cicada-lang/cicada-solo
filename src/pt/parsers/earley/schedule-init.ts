import * as Schedule from "./schedule"
import * as Value from "../../value"
import * as Token from "../../token"

export function init(
  tokens: Array<Token.Token>,
  grammar: Value.Value
): Schedule.Schedule {
  const queue = new Array()
  // NOTE chart.length === tokens.length + 1
  const chart = new Array()
  for (let i = 0; i < tokens.length + 1; i++) {
    chart.push(new Map())
  }
  const schedule = new Schedule.Schedule(queue, chart)
  Schedule.add_grammar(schedule, grammar, 0)
  return schedule
}
