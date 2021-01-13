import { run } from "../run"
import { World } from "../world"
import { Define, Show } from "../stmts"
import { Var, Let } from "../jos"
import { JoJo } from "../jos"
import { Str, StrLit } from "../jos"
import { Type } from "../jos"

{
  const world = World.init()
  const stmts = [
    Define(
      "swap",
      JoJo([StrLit("A"), StrLit("B")]),
      JoJo([StrLit("B"), StrLit("A")]),
      JoJo([Let("b"), Let("a"), Var("b"), Var("a")])
    ),
    Show(JoJo([StrLit("a"), StrLit("b")])),
    Show(JoJo([StrLit("a"), StrLit("b"), Var("swap")])),
    Show(
      JoJo([
        JoJo([StrLit("a"), StrLit("b"), Var("swap")]),
        JoJo([StrLit("a"), StrLit("b"), Var("swap")]),
      ])
    ),
    Show(JoJo([JoJo([Let("b"), Let("a"), Var("b"), Var("a")])])),
  ]
  console.log(run(stmts, world))
}
