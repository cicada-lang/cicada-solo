import { Mod } from "../mod"
import { StmtMeta, StmtOutput } from "../stmt"

export abstract class Stmt {
  abstract meta: StmtMeta

  abstract execute(mod: Mod): Promise<StmtOutput | void>
  abstract format(): string
}
