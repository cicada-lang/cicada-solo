import { StmtOutput } from "../stmt-output"
import { Core } from "../../core"
import * as ut from "../../../ut"

export class NormalTerm extends StmtOutput {
  exp: Core
  t: Core

  constructor(opts: { exp: Core; t: Core }) {
    super()
    this.exp = opts.exp
    this.t = opts.t
  }

  repr(): string {
    return `${this.exp.repr()}: ${this.t.repr()}`
  }

  formatForConsole(): string {
    const exp_repr = ut.colors.yellow(this.exp.repr())
    const t_repr = ut.colors.blue(this.t.repr())
    return `${exp_repr}: ${t_repr}`
  }
}
