import * as TaskChart from "../task-chart"
import * as Task from "../task"
import * as ut from "../../../ut"

export function insert(
  chart: TaskChart.TaskChart,
  index: number,
  task: Task.Task,
  opts: {
    on_new_task?: (task: Task.Task) => void
  } = {}
): boolean {
  const id = Task.id(task)
  const task_set = chart.task_sets[index]

  if (!task_set.has(id)) {
    task_set.set(id, task)

    const indexing_set = chart.resumable_indexing_sets[index]
    extend_resumable_indexing_set(indexing_set, id, task)

    if (opts.on_new_task) {
      opts.on_new_task(task)
    }
    return true
  } else {
    return false
  }
}

function extend_resumable_indexing_set(
  indexing_set: Map<
    TaskChart.GrammarName,
    Map<TaskChart.TaskId, TaskChart.ResumableEntry>
  >,
  task_id: TaskChart.TaskId,
  task: Task.Task
): void {
  if (Task.finished_p(task)) return

  const { value } = Task.next_part(task)
  if (value.kind === "Value.grammar") {
    const grammar = value
    const task_set = indexing_set.get(grammar.name)
    if (task_set !== undefined) {
      if (!task_set.has(task_id)) {
        task_set.set(task_id, { task, grammar })
      }
    } else {
      const new_task_set = new Map()
      new_task_set.set(task_id, { task, grammar })
      indexing_set.set(grammar.name, new_task_set)
    }
  }
}
