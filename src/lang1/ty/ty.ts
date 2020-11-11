export type Ty = nat | arrow

type nat = {
  kind: "Ty.nat"
}

export const nat: nat = { kind: "Ty.nat" }

type arrow = {
  kind: "Ty.arrow"
  arg_t: Ty
  ret_t: Ty
}

export const arrow = (arg_t: Ty, ret_t: Ty): arrow => ({
  kind: "Ty.arrow",
  arg_t,
  ret_t,
})
