import { Exp, infer } from "../exp"
import { Mod } from "../mod"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class Let extends Stmt {
  meta: StmtMeta
  name: string
  exp: Exp

  constructor(name: string, exp: Exp, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.exp = exp
  }

  async execute(mod: Mod): Promise<StmtOutput | void> {
    mod.extendTypedCore(this.name, infer(mod.ctx, this.exp))
  }

  format(): string {
    return `let ${this.name} = ${this.exp.format()}`
  }
}
