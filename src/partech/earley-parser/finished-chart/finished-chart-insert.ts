import * as FinishedChart from "../finished-chart"
import * as Task from "../task"

export function insert(
  finished_chart: FinishedChart.FinishedChart,
  task: Task.Task
): void {
  const index = task.index
  const finished_map = finished_chart[index]
  const task_map = finished_map.get(task.grammar_name)
  const id = Task.id(task)
  if (task_map !== undefined) {
    if (!task_map.has(id)) {
      task_map.set(id, task)
    }
  } else {
    const new_task_map = new Map()
    new_task_map.set(id, task)
    finished_map.set(task.grammar_name, new_task_map)
  }
}
