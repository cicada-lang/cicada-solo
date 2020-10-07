import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as Value from "../../value"
import * as Token from "../../token"

export interface Schedule {
  tokens: Array<Token.Token>
  grammar: Value.grammar
  queue: TaskQueue.TaskQueue
  chart: TaskChart.TaskChart
}
