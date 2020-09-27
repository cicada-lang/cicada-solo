import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as Value from "../../value"
import * as Token from "../../token"

export function create(
  tokens: Array<Token.Token>,
  grammar: Value.grammar
): Schedule.Schedule {
  const queue = TaskQueue.create()
  const chart = TaskChart.create(tokens)
  const schedule = { tokens, grammar, queue, chart }
  Schedule.add_grammar(schedule, grammar, 0)
  return schedule
}
