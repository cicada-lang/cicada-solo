import * as Value from "../../value"

export type Task = {
  grammar_name: string
  choice_name: string
  parts: Array<{ name?: string; value: Value.Value }>
  index: number
  progress: Array<{ index: number; choice_name?: string }>
  id_head: string
  id_body: string
}
