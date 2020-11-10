export const tops = {
  $grammar: {
    "tops:tops": [{ tops: { $ap: ["zero_or_more", "top"] } }],
  },
}

export const top = {
  $grammar: {
    "top:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
    "top:claim": [
      { claim: "identifier" },
      '":"',
      { t: "exp" },
      { define: "identifier" },
      '"="',
      { exp: "exp" },
    ],
    "top:show": ['"@"', '"show"', { exp: "exp" }],
    "top:datatype": [
      '"@"',
      '"datatype"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"{"',
      { sums: "sums" },
      '"}"',
    ],
  },
}

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
