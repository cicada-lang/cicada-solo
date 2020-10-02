import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function upsteam_tasks(
  chart: TaskChart.TaskChart,
  task: Task.Task
): IterableIterator<Task.Task> {
  const task_indexing_set = chart.resumable_task_indexing_sets[task.index]
  const task_set = task_indexing_set.get(task.grammar_name)
  if (task_set !== undefined) {
    return task_set.values()
  } else {
    const empty_map = new Map()
    return empty_map.values()
  }
}

// export function upsteam_tasks(
//   chart: TaskChart.TaskChart,
//   task: Task.Task
// ): IterableIterator<Task.Task> {
//   const task_set = chart.task_sets[task.index]
//   return task_set.values()
// }
