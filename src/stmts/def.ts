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

  async execute(world: World): Promise<void> {
    world.ctx = world.ctx.extend(
      this.name,
      infer(world.ctx, this.exp),
      evaluate(world.ctx.to_env(), this.exp)
    )
    world.env = world.env.extend(this.name, evaluate(world.env, this.exp))
  }
}
