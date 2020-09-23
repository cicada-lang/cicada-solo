import * as Schedule from "./schedule"
import * as Task from "./task"

export function add_task(
  schedule: Schedule.Schedule,
  task_id: string,
  task: Task.Task
): void {
  if (!schedule.chart[task.current_index].has(task_id)) {
    schedule.chart[task.current_index].set(task_id, task)
    schedule.queue.push(task)
  }
}
