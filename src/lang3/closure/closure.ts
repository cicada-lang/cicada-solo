import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Env from "../env"

export class Closure {
  constructor(
    public mod: Mod.Mod,
    public env: Env.Env,
    public name: string,
    public ret: Exp.Exp
  ) {}
}
