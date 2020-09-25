import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Value from "../../../value"
import * as Token from "../../../token"
import * as Span from "../../../span"
import * as Tree from "../../../tree"
import * as ut from "../../../../ut"

export function collect(schedule: Schedule.Schedule): Tree.Tree {
  // NOTE
  //   since
  //     tokens.length + 1 == chart.length
  //   we need to use tokens.length as the end index
  //   instead of tokens.length - 1
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
        const body = {} // TODO
        // Schedule.collect_children(
        //   schedule,
        //   grammar.choices[task.choice_name],
        //   task.matches,
        //   start
        // )
        return Tree.node(head, body)
      } else {
        // DEBUG
        // console.log("// The following task is not equal to rule:")
        // console.log("rule:", ut.inspect(rule))
        // console.log("task.rule:", ut.inspect(task.rule))
        // console.log({
        //   rule: rule,
        //   "task.rule": task.rule,
        //   task: Task.repr(task),
        //   start,
        //   "task.start": task.start,
        //   end,
        //   "task.current": task.current,
        //   "task.program_counter": task.program_counter,
        //   "task.instructions.length": task.instructions.length,
        // })
      }
    }
  }

  throw new Error("PARSING_ERROR")
  // throw Schedule.parsing_error(schedule, rule, start, end)
}

// function span_from_token_lo_hi(
//   tokens: Array<Token.Token>,
//   token_lo: number,
//   token_hi: number
// ): Span.Span {
//   if (token_lo === token_hi) {
//     const token = tokens[token_lo]
//     if (token !== undefined) {
//       return tokens[token_lo].span
//     } else {
//       return new Span.Span(0, 0)
//     }
//   } else {
//     const lo = tokens[token_lo].span.lo
//     const hi = tokens[token_hi - 1].span.hi
//     return new Span.Span(lo, hi)
//   }
// }

// export function collect_children(
//   schedule: Schedule.Schedule,
//   syms: Array<Sym.Sym>,
//   matches: Array<Matched.Matched>,
//   start: number
// ): Array<Tree.Tree> {
//   if (syms.length !== matches.length) {
//     throw new Err.Parsing(
//       "collect_children fail\n" +
//         `syms.length: ${syms.length}\n` +
//         `matches.length: ${matches.length}\n` +
//         `syms: ${ut.inspect(syms)}\n` +
//         `matches: ${ut.inspect(matches)}\n`,
//       span_from_token_lo_hi(schedule.tokens, start, schedule.tokens.length - 1)
//     )
//   }

//   const children = new Array()
//   let index = start
//   for (let i = 0; i < syms.length; i++) {
//     const matched = matches[i]
//     if (matched instanceof Matched.Terminal) {
//       const token = schedule.tokens[matched.index - 1]
//       const leaf = new Tree.Leaf(token)
//       children.push(leaf)
//       index = matched.index
//     } else if (matched instanceof Matched.NonTerminal) {
//       const sym = syms[i]
//       if (sym instanceof Sym.NonTerminal) {
//         const rule = Sym.create_rule_from_non_terminal(sym)
//         const node = collect_node(schedule, rule, index, matched.index)
//         children.push(node)
//         index = matched.index
//       } else {
//         throw new Err.Unhandled(sym)
//       }
//     }
//   }

//   return children
// }
