import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"
import * as Token from "../../token"
import * as Span from "../../span"
import * as Value from "../../value"
import { ParsingError } from "../../errors"

// NOTE three kinds of errors in the following function:
//   "(a b c"    --  "found END_OF_TOKENS, while expecting: ..."
//   "(a b c))"  --  "found token: ..., while expecting END_OF_TOKENS."
//   "(a ? c)"   --  "found token: ..., while expecting: ..."
export function parsing_error(
  schedule: Schedule.Schedule,
  grammar: Value.grammar,
  start: number,
  end: number
): ParsingError {
  throw new Error()
  // const i = find_last_index(schedule, start, end)
  // if (index_still_can_scan(schedule, i)) {
  //   if (i === schedule.tokens.length - 1) {
  //     let s = ""
  //     s += `found END_OF_TOKENS, `
  //     s += "while expecting:\n"
  //     for (const task of schedule.chart[i].values()) {
  //       if (task_terminal_p(task)) {
  //         s += " "
  //         s += Sym.repr(task.parts[task.progress.length])
  //         s += " according to:\n"
  //         s += "     "
  //         s += Task.repr(task)
  //         s += "\n"
  //       }
  //     }
  //     const span = schedule.tokens[i].span
  //     return new ParsingError(s, new Span.Span(span.hi, span.hi))
  //   } else {
  //     let s = ""
  //     s += `found token: "${Token.repr(schedule.tokens[i])}", `
  //     s += "while expecting END_OF_TOKENS.\n"
  //     return new ParsingError(s, schedule.tokens[i].span)
  //   }
  // } else {
  //   let s = ""
  //   s += `found token: "${Token.repr(schedule.tokens[i])}", `
  //   s += "while expecting:\n"
  //   for (const task of schedule.chart[i].values()) {
  //     if (task_terminal_p(task)) {
  //       s += " "
  //       s += Sym.repr(task.parts[task.progress.length])
  //       s += " according to:\n"
  //       s += "     "
  //       s += Task.repr(task)
  //       s += "\n"
  //     }
  //   }
  //   return new ParsingError(s, schedule.tokens[i].span)
  // }
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
  const tasks = schedule.chart[i]
  return tasks.size !== 0 && Array.from(tasks.values()).some(task_terminal_p)
}

function task_terminal_p(task: Task.Task): boolean {
  const index = task.progress.length
  const { value } = task.parts[index]
  return index < task.parts.length && Value.terminal_p(value)
}

function index_still_can_scan(schedule: Schedule.Schedule, i: number): boolean {
  for (const task of TaskChart.tasks_at(schedule.chart, i)) {
    const index = task.progress.length
    if (index < task.parts.length) {
      const { value } = task.parts[index]
      if (Value.terminal_p(value)) {
        const token = schedule.tokens[i]
        // TODO
        // if (Value.terminal_match(value, token)) {
        //   return true
        // }
      }
    }
  }
  return false
}
