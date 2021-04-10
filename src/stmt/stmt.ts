import { Module } from "../module"

export type Stmt = {
  execute(mod: Module): Promise<void>
}
