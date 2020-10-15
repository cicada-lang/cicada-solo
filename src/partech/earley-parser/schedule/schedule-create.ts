import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as ResumableChart from "../resumable-chart"
import * as FinishedChart from "../finished-chart"
import * as Value from "../../value"
import * as Token from "../../token"

export function create(
  tokens: Array<Token.Token>,
  grammar: Value.grammar
): Schedule.Schedule {
  const schedule = {
    tokens,
    grammar,
    queue: TaskQueue.create(),
    chart: TaskChart.create(tokens),
    resumable_chart: ResumableChart.create(tokens),
    finished_chart: FinishedChart.create(tokens),
  }
  Schedule.insert_grammar(schedule, grammar, 0)
  return schedule
}
