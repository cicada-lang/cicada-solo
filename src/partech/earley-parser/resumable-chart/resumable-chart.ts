import * as Task from "../task"
import * as Value from "../../value"

export type TaskId = string
export type GrammarName = string
export type ResumableEntry = { grammar: Value.grammar; task: Task.Task }

// NOTE to optimise `Schedule.resume`

export type ResumableChart = Array<
  Map<GrammarName, Map<TaskId, ResumableEntry>>
>
