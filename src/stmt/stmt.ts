import { Module } from "../module"
import pt from "@cicada-lang/partech"

export interface StmtMeta {
  span: pt.Span
}

export abstract class Stmt {
  abstract meta: StmtMeta

  abstract execute(mod: Module): Promise<void>
  abstract repr(): string
}
