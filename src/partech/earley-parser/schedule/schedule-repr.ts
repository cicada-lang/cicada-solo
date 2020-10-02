import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as TaskQueue from "../task-queue"
import * as Task from "../task"

export function repr(schedule: Schedule.Schedule): string {
  return repr_queue(schedule.queue) + repr_chart(schedule.chart)
}

function repr_queue(queue: TaskQueue.TaskQueue): string {
  let s = ""
  s += "QUEUE:\n"
  for (const task of queue) {
    s += "  " + Task.repr(task) + "\n"
  }
  return s
}

function repr_chart(chart: TaskChart.TaskChart): string {
  let s = ""
  const length = TaskChart.length(chart)
  for (let i = 0; i < length; i++) {
    s += i + (i === length - 1 ? " // END" : "") + "\n"
    for (const task of TaskChart.tasks_at(chart, i)) {
      s += "  " + Task.repr(task) + "\n"
    }
  }
  return s
}
