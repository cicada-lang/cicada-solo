import * as EarleyParser from "../earley-parser"
import * as Schedule from "./schedule"
import * as Task from "./task"
import * as Value from "../value"
import * as Token from "../token"
import * as Tree from "../tree"
import * as ut from "../../ut"

export function create(
  grammar: Value.Value,
  opts: Schedule.Opts = Schedule.DEFAULT_OPTS
): EarleyParser.EarleyParser {
  if (grammar.kind !== "Value.grammar") {
    throw new Error(
      `expecting grammar to be Value.grammar.\n` +
        `grammar: ${ut.inspect(grammar)}\n`
    )
  }

  return {
    grammar,
    opts,

    parse(tokens: Array<Token.Token>): Tree.Tree {
      const schedule = Schedule.create(tokens, grammar)
      Schedule.run(schedule, opts)
      return Schedule.harvest(schedule)
    },

    recognize(tokens: Array<Token.Token>): boolean {
      const schedule = Schedule.create(tokens, grammar)
      Schedule.run(schedule, opts)
      const end = schedule.chart[schedule.chart.length - 1]
      const ending_task_p = (task: Task.Task): boolean =>
        Task.match_grammar_p(task, grammar) &&
        Task.current_index(task) === tokens.length
      return Array.from(end.values()).some(ending_task_p)
    },
  }
}
