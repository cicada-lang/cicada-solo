import { Value } from "../value"

export class ValueStack {
  stack: Array<Value>

  constructor(stack?: Array<Value>) {
    this.stack = stack || new Array()
  }

  push(value: Value): ValueStack {
    return new ValueStack([value, ...this.stack])
  }

  drop(): ValueStack {
    return new ValueStack(this.stack.slice(1))
  }

  tos(): Value {
    return this.stack[0]
  }

  pop(): [Value, ValueStack] {
    return [this.stack[0], new ValueStack(this.stack.slice(1))]
  }
}
