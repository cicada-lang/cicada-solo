import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"

export type ArgEntry = {
  kind: "plain" | "implicit" | "returned"
  arg: Exp
}

export type ArgCoreEntry = {
  kind: "plain" | "implicit" | "returned"
  arg: Core
}

export type ArgValueEntry = {
  kind: "plain" | "implicit" | "returned"
  arg: Value
}
