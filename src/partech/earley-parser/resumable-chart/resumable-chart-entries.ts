import * as ResumableChart from "../resumable-chart"
import * as Task from "../task"

export function entries(
  resumable_chart: ResumableChart.ResumableChart,
  task: Task.Task
): IterableIterator<ResumableChart.ResumableEntry> {
  const task_map = resumable_chart[task.index].get(task.grammar_name)
  if (task_map !== undefined) {
    return task_map.values()
  } else {
    const empty_map = new Map()
    return empty_map.values()
  }
}
