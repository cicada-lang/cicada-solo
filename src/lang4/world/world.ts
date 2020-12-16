import { FrameStack } from "../frame-stack"
import { ValueStack } from "../value-stack"
import { ValueTable } from "../value-table"

export type World = {
  value_table: ValueTable
  value_stack: ValueStack
  return_stack: FrameStack
}

export function World(the: {
  value_table: ValueTable
  value_stack: ValueStack
  return_stack: FrameStack
}): World {
  return the
}
