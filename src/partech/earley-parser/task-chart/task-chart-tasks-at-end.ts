import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function tasks_at_end(
  chart: TaskChart.TaskChart
): IterableIterator<Task.Task> {
  return TaskChart.tasks_at(chart, TaskChart.length(chart) - 1)
}
