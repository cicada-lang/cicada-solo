import * as Value from "../../../value"

export class Task {
  grammar_name: string
  choice_name: string
  parts: Array<{ name?: string; value: Value.Value }>
  index: number // NOTE into token
  progress: Array<{ index: number; choice_name?: string }>

  constructor(the: {
    grammar_name: string
    choice_name: string
    parts: Array<{ name?: string; value: Value.Value }>
    index: number
    progress: Array<{ index: number; choice_name?: string }>
  }) {
    this.grammar_name = the.grammar_name
    this.choice_name = the.choice_name
    this.parts = the.parts
    this.index = the.index
    this.progress = the.progress
  }
}
