import { Jo } from "../jo"

export type Var = Jo & {
  name: string
}

export function Var(name: string): Var {
  return {
    name,
    composability(worlds) {
      // TODO lookup env
      return worlds
    },
    cuttability(worlds) {
      // TODO lookup ctx
      return worlds
    },
  }
}
