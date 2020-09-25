import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Value from "../../../value"
import * as Token from "../../../token"
import * as Span from "../../../span"
import * as Tree from "../../../tree"
import { Obj } from "../../../../ut"
import * as ut from "../../../../ut"

export function collect(schedule: Schedule.Schedule): Tree.Tree {
  // NOTE
  //   since
  //     tokens.length + 1 === chart.length
  //   we need to use
  //     tokens.length
  //   as the end index
  //   instead of
  //     tokens.length - 1
  const start = 0
  const end = schedule.tokens.length
  return collect_node(schedule, schedule.grammar, start, end)
}

function collect_node(
  schedule: Schedule.Schedule,
  grammar: Value.grammar,
  start: number,
  end: number
): Tree.Tree {
  for (const task of schedule.chart[end].values()) {
    if (
      start === task.index &&
        end === Task.current_index(task) &&
        task.progress.length === task.parts.length
    ) {
      if (Task.match_grammar_p(task, grammar)) {
        const head = {
          name: grammar.name,
          kind: task.choice_name,
        }
        const choices = Value.DelayedChoices.force(grammar.delayed)
        const parts = choices.get(task.choice_name)
        if (parts === undefined) throw new Error(`can not find choice: ${task.choice_name}`)
        const body = collect_body(schedule, parts, task.progress, start)
        return Tree.node(head, body)
      }
    }
  }

  throw new Error("PARSING_ERROR")
}

function collect_body(
  schedule: Schedule.Schedule,
  parts: Array<{ name?: string; value: Value.Value }>,
  progress: Array<{ index: number; choice_name?: string }>,
  start: number
): Obj<Tree.Tree> {
  throw new Error()

  // if (parts.length !== progress.length) {
  //   throw new Error("parts.length !== progress.length")
  // }

  // const children = new Array()

  // let index = start
  // for (let i = 0; i < parts.length; i++) {
  //   const matched = progress[i]
  //   if (matched instanceof Matched.Terminal) {
  //     const token = schedule.tokens[matched.index - 1]
  //     const leaf = new Tree.Leaf(token)
  //     children.push(leaf)
  //     index = matched.index
  //   } else if (matched instanceof Matched.NonTerminal) {
  //     const sym = parts[i]
  //     if (sym instanceof Sym.NonTerminal) {
  //       const rule = Sym.create_rule_from_non_terminal(sym)
  //       const node = collect_node(schedule, rule, index, matched.index)
  //       children.push(node)
  //       index = matched.index
  //     } else {
  //       throw new Err.Unhandled(sym)
  //     }
  //   }
  // }

  // return children
}
