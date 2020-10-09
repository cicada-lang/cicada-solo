import * as Task from "../task"
import * as Value from "../../value"

export function start(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Value.Value }>,
  index: number // NOTE into token
): Task.Task {
  return {
    grammar_name,
    choice_name,
    parts,
    index,
    progress: [],
    id_cache: undefined,
  }
}
