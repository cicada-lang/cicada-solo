import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function insert_task(
  schedule: Schedule.Schedule,
  task: Task.Task
): void {
  const index = Task.next_index(task)
  TaskChart.insert(schedule.chart, index, task, {
    on_new_task: (task) => {
      TaskQueue.enqueue(schedule.queue, task)
    },
  })
}
