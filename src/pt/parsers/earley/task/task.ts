import * as Value from "../../../value"

export interface Task {
  grammar_name: string
  choice_name: string
  parts: Array<{ name?: string; value: Value.Value }>
  index: number // NOTE into token
  progress: Array<{ index: number; choice_name?: string }>
}
