import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as FinishedChart from "../finished-chart"
import { ParsingError } from "../../errors"
import * as Value from "../../value"
import * as Task from "../task"
import * as ut from "../../../ut"

export function leap(
  schedule: Schedule.Schedule,
  upsteam_task: Task.Task
): void {
  const { value } = Task.next_part(upsteam_task)
  if (value.kind === "Value.grammar") {
    const grammar = value
    const progress_index = Task.progress_index(upsteam_task)
    const length = TaskChart.length(schedule.chart)
    for (const task of FinishedChart.entries(
      schedule.finished_chart,
      progress_index,
      grammar.name
    )) {
      if (Task.match_grammar_p(task, grammar)) {
        const forward_steps = Task.progress_index(task) - task.index
        Schedule.insert_task(
          schedule,
          Task.advance(upsteam_task, {
            index: Task.progress_index(upsteam_task) + forward_steps,
            choice_name: task.choice_name,
          })
        )
      }
    }
  }
}
