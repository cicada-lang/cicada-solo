export const sums = {
  $grammar: {
    "sums:sums": [{ sums: { $ap: ["zero_or_more", "sum_entry"] } }],
  },
}

export const sum_entry = {
  $grammar: {
    "sum_entry:sum_entry": [{ tag: "identifier" }, '":"', { t: "exp" }],
  },
}
