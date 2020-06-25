export type Ty = Nat | Arrow

export interface Nat {
  kind: "Ty.Nat"
}

export interface Arrow {
  kind: "Ty.Arrow"
  arg: Ty
  ret: Ty
}
