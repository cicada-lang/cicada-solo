import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function resumable_entries(
  chart: TaskChart.TaskChart,
  task: Task.Task
): IterableIterator<TaskChart.ResumableEntry> {
  const indexing_set = chart.resumable_indexing_sets[task.index]
  const task_set = indexing_set.get(task.grammar_name)
  if (task_set !== undefined) {
    return task_set.values()
  } else {
    const empty_map = new Map()
    return empty_map.values()
  }
}
