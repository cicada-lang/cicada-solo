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
    TaskQueue.enqueue(schedule.queue, task)
    ResumableChart.insert(schedule.resumable_chart, task)
  }
}
