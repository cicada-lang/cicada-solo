import { Exp, infer } from "../exp"
import * as Exps from "../exps"
import { Mod } from "../mod"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class Datatype extends Stmt {
  meta: StmtMeta
  name: string
  datatype: Exps.TypeCtor

  constructor(
    name: string,
    fixed: Record<string, Exp>,
    varied: Record<string, Exp>,
    ctors: Record<string, Exp>,
    meta: StmtMeta
  ) {
    super()
    this.meta = meta
    this.name = name
    this.datatype = new Exps.TypeCtor(name, fixed, varied, ctors)
  }

  async execute(mod: Mod): Promise<StmtOutput | undefined> {
    mod.extendTypedCore(this.name, infer(mod.ctx, this.datatype))
    return undefined
  }

  format(): string {
    return this.datatype.format()
  }
}
