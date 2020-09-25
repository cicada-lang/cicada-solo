import * as Task from "../task"
import * as Value from "../../../value"
import * as Token from "../../../token"
import * as ut from "../../../../ut"

export interface Schedule {
  tokens: Array<Token.Token>
  grammar: Value.grammar
  queue: Array<Task.Task>
  chart: Array<Map<string, Task.Task>>
}
