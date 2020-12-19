import { Arrow } from "../tys/arrow"

export type Ty = nat | Arrow

export type nat = {
  kind: "Ty.nat"
}

export const nat: nat = { kind: "Ty.nat" }

export type arrow = Arrow
export const arrow = Arrow
