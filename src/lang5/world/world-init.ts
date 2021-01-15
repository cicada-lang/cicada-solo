import { World } from "./world"
import { ValueStack } from "../value-stack"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"

declare module "./world" {
  namespace World {
    function init(): World
  }
}

World.init = () =>
  World({
    env: Env(new Map()),
    mod: Mod(new Map()),
    value_stack: ValueStack([], 0),
  })
