import * as ut from "../../../utils"
import { Core } from "../../core"
import { StmtOutput } from "../stmt-output"

export class NormalTerm extends StmtOutput {
  exp: Core
  t: Core

  constructor(opts: { exp: Core; t: Core }) {
    super()
    this.exp = opts.exp
    this.t = opts.t
  }

  format(): string {
    return `${this.exp.format()}: ${this.t.format()}`
  }

  formatForConsole(): string {
    const exp_format = ut.colors.yellow(this.exp.format())
    const t_format = ut.colors.blue(this.t.format())
    return `${exp_format}: ${t_format}`
  }
}
