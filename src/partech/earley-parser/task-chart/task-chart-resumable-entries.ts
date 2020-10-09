import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function resumable_entries(
  chart: TaskChart.TaskChart,
  task: Task.Task
): IterableIterator<TaskChart.ResumableEntry> {
  const indexing_set = chart.resumable_task_chart[task.index]
  const task_map = indexing_set.get(task.grammar_name)
  if (task_map !== undefined) {
    return task_map.values()
  } else {
    const empty_map = new Map()
    return empty_map.values()
  }
}
