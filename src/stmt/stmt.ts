import { Module } from "../module"

export abstract class Stmt {
  abstract execute(mod: Module): Promise<void>
  abstract repr(): string
}
