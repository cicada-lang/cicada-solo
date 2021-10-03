import { Module } from "../module"
import pt from "@cicada-lang/partech"

export abstract class Stmt {
  abstract meta: { span: pt.Span }
  abstract execute(mod: Module): Promise<void>
  abstract repr(): string
}
