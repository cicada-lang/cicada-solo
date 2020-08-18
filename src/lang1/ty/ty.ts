export type Ty = nat | arrow

export interface nat {
  kind: "Ty.nat"
}

export interface arrow {
  kind: "Ty.arrow"
  arg_t: Ty
  ret_t: Ty
}
