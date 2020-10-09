import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as ResumableChart from "../resumable-chart"
import * as Task from "../task"

export function insert_task(
  schedule: Schedule.Schedule,
  task: Task.Task
): void {
  const index = Task.progress_index(task)
  if (TaskChart.insert(schedule.chart, index, task)) {
    const resumable_map = schedule.resumable_chart[index]
    extend_resumable_resumable_map(resumable_map, task)
    TaskQueue.enqueue(schedule.queue, task)
  }
}

function extend_resumable_resumable_map(
  resumable_map: Map<
    ResumableChart.GrammarName,
    Map<ResumableChart.TaskId, ResumableChart.ResumableEntry>
  >,
  task: Task.Task
): void {
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
