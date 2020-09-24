import * as Schedule from "../schedule"
import * as Task from "../task"

export function repr(schedule: Schedule.Schedule): string {
  return (
    Schedule.repr_queue(schedule.queue) + Schedule.repr_chart(schedule.chart)
  )
}

export function repr_queue(queue: Array<Task.Task>): string {
  let s = ""
  s += "QUEUE:\n"
  for (const task of queue) {
    s += "  " + Task.repr(task)
    s += "\n"
  }
  return s
}

export function repr_chart(chart: Array<Map<string, Task.Task>>): string {
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
