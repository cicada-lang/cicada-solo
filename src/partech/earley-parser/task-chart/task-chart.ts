import * as Task from "../task"
import * as Value from "../../value"

export type TaskId = string
export type GrammarName = string
export type ResumableEntry = { grammar: Value.grammar; task: Task.Task }

export interface TaskChart {
  task_maps: Array<Map<TaskId, Task.Task>>
  resumable_task_chart: Array<Map<GrammarName, Map<TaskId, ResumableEntry>>>
}
