export const ty = {
  $grammar: {
    "ty:nat": ['"NatTy"'],
    "ty:arrow": ['"("', { arg_t: "ty" }, '")"', '"-"', '">"', { ret_t: "ty" }],
  },
}
