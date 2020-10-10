import * as ResumableChart from "../resumable-chart"
import * as Task from "../task"

export function insert(
  resumable_chart: ResumableChart.ResumableChart,
  task: Task.Task
): void {
  const index = Task.progress_index(task)
  const resumable_map = resumable_chart[index]
  if (Task.finished_p(task)) return
  const { value } = Task.next_part(task)
  if (value.kind === "Value.grammar") {
    const grammar = value
    const task_map = resumable_map.get(grammar.name)
    const id = Task.id(task)
    if (task_map !== undefined) {
      if (!task_map.has(id)) {
        task_map.set(id, { task, grammar })
      }
    } else {
      const new_task_map = new Map()
      new_task_map.set(id, { task, grammar })
      resumable_map.set(grammar.name, new_task_map)
    }
  }
}
