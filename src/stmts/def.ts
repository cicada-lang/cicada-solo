import { Stmt } from "../stmt"
import { World } from "../world"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"

export class Def implements Stmt {
  name: string
  exp: Exp

  constructor(name: string, exp: Exp) {
    this.name = name
    this.exp = exp
  }

  execute(world: World): World {
    return world
      .ctx_extend(
        this.name,
        infer(world.ctx, this.exp),
        evaluate(world.ctx.to_env(), this.exp)
      )
      .env_extend(this.name, evaluate(world.env, this.exp))
  }
}
