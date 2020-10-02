import * as Task from "../task"

// export type TaskChart = Array<Map<string, Task.Task>>

export interface TaskChart {
  tasksets: Array<Map<string, Task.Task>>
}

// resumable_task_table
