import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as TaskQueue from "../task-queue"
import * as Task from "../task"

export function repr(schedule: Schedule.Schedule): string {
  return (
    repr_queue(schedule.queue) + repr_chart(schedule.chart)
  )
}

function repr_queue(queue: TaskQueue.TaskQueue): string {
  let s = ""
  s += "QUEUE:\n"
  for (const task of queue) {
    s += "  " + Task.repr(task)
    s += "\n"
  }
  return s
}

function repr_chart(chart: TaskChart.TaskChart): string {
  let s = ""
  for (let i = 0; i < chart.length; i++) {
    if (i === chart.length - 1) {
      s += i + " // END"
    } else {
      s += i
    }
    s += "\n"
    for (const task of chart[i].values()) {
      s += "  " + Task.repr(task)
      s += "\n"
    }
  }
  return s
}
