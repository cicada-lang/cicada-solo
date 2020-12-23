import { run } from "../run"
import { World } from "../world"
import { Define, Show } from "../stmts"
import { Var, Goin } from "../jos"
import { JoJo } from "../jos"
import { Str, Quote } from "../jos"
import { Type } from "../jos"

{
  const world = World.init()
  const stmts = [Show(JoJo([Type]))]
  console.log(run(stmts, world))
}
