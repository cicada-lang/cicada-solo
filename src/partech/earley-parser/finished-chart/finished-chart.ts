import * as Task from "../task"
import * as Value from "../../value"

export type TaskId = string
export type GrammarName = string
export type FinishedEntry = Task.Task

// NOTE to optimise `Schedule.resume`

export type FinishedChart = Array<Map<GrammarName, Map<TaskId, FinishedEntry>>>
