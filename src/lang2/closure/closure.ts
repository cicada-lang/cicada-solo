import * as Exp from "../exp"
import * as Env from "../env"

export class Closure {
  constructor(public env: Env.Env, public name: string, public body: Exp.Exp) {}
}
