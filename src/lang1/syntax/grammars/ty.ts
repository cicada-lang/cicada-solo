export const ty = {
  $grammar: {
    "ty:nat": ['"Nat"'],
    "ty:arrow": ['"("', { arg_t: "ty" }, '")"', '"-"', '">"', { ret_t: "ty" }],
  },
}
