import * as Task from "../task"
import * as Value from "../../value"

export function start(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Value.Value }>,
  index: number
): Task.Task {
  return {
    grammar_name,
    choice_name,
    parts,
    index,
    progress: [],
    id_head: format_id_head(grammar_name, choice_name, parts, index),
    id_body: "",
  }
}

function format_id_head(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Value.Value }>,
  index: number
): string {
  let s = grammar_name + ":" + choice_name + "@" + index + " -> "
  for (let i = 0; i < parts.length; i++) {
    s += repr_part(parts[i])
    s += " "
  }
  return s
}

function repr_part(part: { name?: string; value: Value.Value }): string {
  const { name, value } = part
  const present = Value.present(value, { on_grammar: "only_show_name" })

  let s = ""
  if (typeof present === "string") {
    s += present.toString()
  } else if (present instanceof Array) {
    s += JSON.stringify(present)
  } else if (present.hasOwnProperty("$pattern")) {
    const [pattern_name] = present["$pattern"]
    s += pattern_name
  } else {
    s += JSON.stringify(present)
  }

  return name ? repr_named(name, s) : s
}

function repr_named(name: string, s: string): string {
  return `(${name}: ${s})`
}
