import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function insert(
  chart: TaskChart.TaskChart,
  index: number,
  task: Task.Task,
  opts: {
    on_new_task?: (task: Task.Task) => void
  } = {}
): boolean {
  const id = Task.id(task)
  const task_map = chart[index]
  if (!task_map.has(id)) {
    task_map.set(id, task)
    if (opts.on_new_task) {
      opts.on_new_task(task)
    }
    return true
  } else {
    return false
  }
}
