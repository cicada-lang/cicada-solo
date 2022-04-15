import pt from "@cicada-lang/partech"
import { Mod } from "../mod"
import { StmtOutput } from "./stmt-output"

export interface StmtMeta {
  span: pt.Span
}

export abstract class Stmt {
  abstract meta: StmtMeta

  abstract execute(mod: Mod): Promise<StmtOutput | void>
  abstract format(): string
}
