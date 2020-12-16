export type ValueStack = {}

export type ReturnStack = {}

export type Value = {}

export type ValueTable = {
  table: Map<string, Value>
}

export type World = {
  env: ValueTable
  value_stack: ValueStack
  return_stack: ReturnStack
}
