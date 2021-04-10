import { Stmt } from "../stmt"
import { World } from "../world"
import { Exp } from "../exp"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { readback } from "../readback"
import { TypeValue } from "../core"

export class Show implements Stmt {
  exp: Exp

  constructor(exp: Exp) {
    this.exp = exp
  }

  async execute(world: World): Promise<void> {
    const t = infer(world.ctx, this.exp)
    const value = evaluate(world.env, this.exp)
    const value_repr = readback(world.ctx, t, value).repr()
    const t_repr = readback(world.ctx, new TypeValue(), t).repr()
    world.output += `@the ${t_repr} ${value_repr}\n`
  }
}
