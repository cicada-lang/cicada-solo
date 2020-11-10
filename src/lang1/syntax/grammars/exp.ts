export const deduction_entry = {
  $grammar: {
    "deduction_entry:deduction_entry": [
      { t: "ty" },
      "dashline",
      { exp: "exp" },
    ],
  },
}

export const exp = {
  $grammar: {
    "exp:var": [{ name: "identifier" }],
    "exp:fn": [
      '"("',
      { name: "identifier" },
      '")"',
      '"="',
      '">"',
      { body: "exp" },
    ],
    "exp:ap": [
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
    "exp:begin": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
    "exp:zero": ['"zero"'],
    "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "exp:number": [{ value: { $pattern: ["number"] } }],
    "exp:rec": [
      '"rec"',
      '"["',
      { t: "ty" },
      '"]"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "exp:deduction": [
      '"{"',
      { deduction_entries: { $ap: ["one_or_more", "deduction_entry"] } },
      { deduction_args: { $ap: ["zero_or_more", "exp"] } },
      '"}"',
    ],
  },
}
