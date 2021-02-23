import { Stmt } from "../stmt"
import { World } from "../world"
import { Exp } from "../exp"
import * as Value from "../value"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import { readback } from "../readback"

export class Show implements Stmt {
  exp: Exp

  constructor(exp: Exp) {
    this.exp = exp
  }

  execute(world: World): World {
    const t = infer(world.ctx, this.exp)
    const value = evaluate(world.env, this.exp)
    const value_repr = readback(world.ctx, t, value).repr()
    const t_repr = readback(world.ctx, Value.type, t).repr()
    return world.output_append(`@the ${t_repr} ${value_repr}\n`)
  }
}
