import pt from "@cicada-lang/partech"
import { Module } from "../../module"
import { StmtOutput } from "./stmt-output"

export interface StmtMeta {
  span: pt.Span
}

export abstract class Stmt {
  abstract meta: StmtMeta

  abstract execute(mod: Module): Promise<StmtOutput | undefined>
  abstract format(): string
}
