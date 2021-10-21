import { Module } from "../../module"
import { StmtOutput } from "./stmt-output"
import pt from "@cicada-lang/partech"

export interface StmtMeta {
  span: pt.Span
}

export abstract class Stmt {
  abstract meta: StmtMeta

  abstract execute(mod: Module): Promise<StmtOutput | undefined>
  abstract repr(): string
}
