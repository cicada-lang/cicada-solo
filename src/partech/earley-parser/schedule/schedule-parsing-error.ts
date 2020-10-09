import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"
import * as Token from "../../token"
import * as Value from "../../value"
import { ParsingError } from "../../errors"

// NOTE three kinds of errors in the following function:
//   "(a b c"    --  "Found END_OF_TOKENS, while expecting: ..."
//   "(a b c))"  --  "Found ..., while expecting END_OF_TOKENS."
//   "(a ? c)"   --  "Found ..., while expecting: ..."
export function parsing_error(
  schedule: Schedule.Schedule,
  grammar: Value.grammar,
  start: number,
  end: number
): ParsingError {
  const i = find_last_index(schedule, start, end)
  if (index_still_can_scan(schedule, i)) {
    if (i === schedule.tokens.length - 1) {
      let s = ""
      s += "Found END_OF_TOKENS, "
      s += "while expecting:\n"
      for (const task of TaskChart.tasks_at(schedule.chart, i - 1)) {
        if (task_terminal_p(task)) {
          s += " "
          const { value } = task.parts[task.progress.length]
          s += Value.repr(value)
          s += ":\n"
          s += "     "
          s += Task.repr(task)
          s += "\n"
        }
      }
      const span = schedule.tokens[i].span
      return new ParsingError(s, { span: { lo: span.hi, hi: span.hi } })
    } else {
      let s = ""
      s += `Found ${Token.report(schedule.tokens[i])}, `
      s += "while expecting END_OF_TOKENS.\n"
      const span = schedule.tokens[i].span
      return new ParsingError(s, { span })
    }
  } else {
    let s = ""
    s += `Found ${Token.report(schedule.tokens[i])}, `
    s += "while expecting:\n"
    for (const task of TaskChart.tasks_at(schedule.chart, i)) {
      if (task_terminal_p(task)) {
        s += " "
        const { value } = task.parts[task.progress.length]
        s += Value.repr(value)
        s += ":\n"
        s += "     "
        s += Task.repr(task)
        s += "\n"
      }
    }
    const span = schedule.tokens[i].span
    return new ParsingError(s, { span })
  }
}

function find_last_index(
  schedule: Schedule.Schedule,
  start: number,
  end: number
): number {
  let index = 0
  for (let i = start; i < end; i++) {
    if (index_with_terminal_p(schedule, i)) {
      index = i
    }
  }

  return index
}

function index_with_terminal_p(
  schedule: Schedule.Schedule,
  i: number
): boolean {
  const tasks = Array.from(TaskChart.tasks_at(schedule.chart, i))
  return tasks.length !== 0 && tasks.some(task_terminal_p)
}

function task_terminal_p(task: Task.Task): boolean {
  const index = task.progress.length
  if (index >= task.parts.length) return false
  const { value } = task.parts[index]
  return Value.terminal_p(value)
}

function index_still_can_scan(schedule: Schedule.Schedule, i: number): boolean {
  for (const task of TaskChart.tasks_at(schedule.chart, i)) {
    const index = task.progress.length
    if (index < task.parts.length) {
      const { value } = task.parts[index]
      if (Value.terminal_p(value)) {
        const token = schedule.tokens[i]
        if (Value.terminal_match(value, token)) {
          return true
        }
      }
    }
  }
  return false
}
