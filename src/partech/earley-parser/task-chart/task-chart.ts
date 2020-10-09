import * as Task from "../task"

export type TaskId = string

export interface TaskChart {
  task_maps: Array<Map<TaskId, Task.Task>>
}
