import { Repr } from "../../repr"

export type Nat = Repr & {
  kind: "Nat"
}

export const Nat: Nat = {
  kind: "Nat",
  repr: () => "Nat",
}
