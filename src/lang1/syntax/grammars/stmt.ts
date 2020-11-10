export const stmt = {
  $grammar: {
    "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:claim": [
      { claim: "identifier" },
      '":"',
      { t: "ty" },
      { define: "identifier" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:show": ['"@"', '"show"', { exp: "exp" }],
  },
}

export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}
