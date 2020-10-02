import * as Task from "../task"

export type TaskId = string
export type GrammarName = string

export interface TaskChart {
  task_sets: Array<Map<TaskId, Task.Task>>
  resumable_task_indexing_sets: Array<Map<GrammarName, Map<TaskId, Task.Task>>>
}
