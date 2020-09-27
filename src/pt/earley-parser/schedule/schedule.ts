import * as Task from "../task"
import * as TaskQueue from "../task-queue"
import * as Value from "../../value"
import * as Token from "../../token"

export interface Schedule {
  tokens: Array<Token.Token>
  grammar: Value.grammar
  queue: TaskQueue.TaskQueue
  chart: Array<Map<string, Task.Task>>
}
