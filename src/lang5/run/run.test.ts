import { run } from "../run"
import { World } from "../world"
import { Env } from "../env"
import { Mod } from "../mod"
import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { Define, Show } from "../stmts"
import { Var, Let } from "../jos"
import { JoJo } from "../jos"
import { StrLit } from "../jos"

{
  const world = World({
    env: Env(new Map()),
    mod: Mod(new Map()),
    value_stack: ValueStack([], 0),
  })
  const stmts = [
    Define("swap", JoJo([Let("b"), Let("a"), Var("b"), Var("a")])),
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
