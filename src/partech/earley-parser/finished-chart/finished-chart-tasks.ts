import * as FinishedChart from "../finished-chart"
import * as Task from "../task"

export function tasks(
  finished_chart: FinishedChart.FinishedChart,
  index: number,
  grammar_name: string
): IterableIterator<Task.Task> {
  const task_map = finished_chart[index].get(grammar_name)
  if (task_map !== undefined) {
    return task_map.values()
  } else {
    const empty_map = new Map()
    return empty_map.values()
  }
}
