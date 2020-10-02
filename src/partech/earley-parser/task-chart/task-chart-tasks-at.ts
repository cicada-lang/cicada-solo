import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function tasks_at(
  chart: TaskChart.TaskChart,
  index: number
): IterableIterator<Task.Task> {
  const task_set = chart.task_sets[index]
  return task_set.values()
}
