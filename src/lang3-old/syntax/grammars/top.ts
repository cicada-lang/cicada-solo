export const tops = {
  $grammar: {
    "tops:tops": [{ tops: { $ap: ["zero_or_more", "top"] } }],
  },
}

export const top = {
  $grammar: {
    "top:import": ['"@"', '"import"', { modpath: "modpath" }],
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
