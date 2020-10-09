import * as TaskChart from "../task-chart"
import * as Task from "../task"
import * as ut from "../../../ut"

export function insert(
  chart: TaskChart.TaskChart,
  index: number,
  task: Task.Task
): boolean {
  const id = Task.id(task)
  const task_map = chart.task_maps[index]
  if (!task_map.has(id)) {
    task_map.set(id, task)
    return true
  } else {
    return false
  }
}
