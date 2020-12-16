import { JoJo } from "./jos/jojo"

export type DataStack = {}

export type ReturnStack = {}

export type JoJoTable = {
  table: Map<string, JoJo>
}

export type World = {
  env: JoJoTable
  ctx: JoJoTable
  data_stack: DataStack
  return_stack: ReturnStack
}
