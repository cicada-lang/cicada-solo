import * as Task from "../task"

export type TaskId = string

export type TaskChart = Array<Map<TaskId, Task.Task>>
