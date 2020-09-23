import * as Value from "../../../value"

export class Task {
  grammar_name: string
  choice_name: string
  parts: Array<{ name?: string; value: Value.Value }>
  index: number // NOTE into token
  matched_indexes: Array<{ index: number; choice_name?: string }>

  constructor(the: {
    grammar_name: string
    choice_name: string
    parts: Array<{ name?: string; value: Value.Value }>
    index: number
    matched_indexes: Array<{ index: number; choice_name?: string }>
  }) {
    this.grammar_name = the.grammar_name
    this.choice_name = the.choice_name
    this.parts = the.parts
    this.index = the.index
    this.matched_indexes = the.matched_indexes
  }

  get current_index(): number {
    if (this.matched_indexes.length === 0) {
      return this.index
    } else {
      const last_matched = this.matched_indexes[this.matched_indexes.length - 1]
      return last_matched.index
    }
  }

  // NOTE index into parts (instructions)
  get program_counter(): number {
    return this.matched_indexes.length
  }

  get current_part(): { name?: string; value: Value.Value } {
    const part = this.parts[this.program_counter]
    if (part !== undefined) {
      return part
    } else {
      throw new Error(
        `current_part is undefined.\n` +
          `program_counter: ${this.program_counter}\n`
      )
    }
  }

  get finished_p(): boolean {
    return this.program_counter === this.parts.length
  }

  get id(): string {
    let s = this.grammar_name + ":" + this.choice_name + "@" + this.index
    for (let i = 0; i < this.matched_indexes.length; i++) {
      const { index, choice_name } = this.matched_indexes[i]
      if (choice_name) {
        s += `(${index}:${choice_name})`
      } else {
        s += `(${index})`
      }
    }
    return s
  }
}
