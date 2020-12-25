import { run } from "../run"
import { World } from "../world"
import { Define, Show } from "../stmts"
import { Var, Let } from "../jos"
import { JoJo } from "../jos"
import { Str, Quote } from "../jos"
import { Type } from "../jos"

{
  const world = World.init()
  const stmts = [
    Define(
      "swap",
      JoJo([Quote("A"), Quote("B")]),
      JoJo([Quote("B"), Quote("A")]),
      JoJo([Let("b"), Let("a"), new Var("b"), new Var("a")])
    ),
    Show(JoJo([Quote("a"), Quote("b")])),
    Show(JoJo([Quote("a"), Quote("b"), new Var("swap")])),
  ]
  console.log(run(stmts, world))
}
