import { FrameStack } from "../frame-stack"
import { ValueStack } from "../value-stack"
import { Env } from "../env"
import { Mod } from "../mod"

export type World = {
  env: Env
  mod: Mod
  value_stack: ValueStack
  return_stack: FrameStack
}

export function World(the: {
  env: Env
  mod: Mod
  value_stack: ValueStack
  return_stack: FrameStack
}): World {
  return the
}
