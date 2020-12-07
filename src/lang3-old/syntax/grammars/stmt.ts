export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:claim": [
      { claim: "identifier" },
      '":"',
      { t: "exp" },
      { define: "identifier" },
      '"="',
      { exp: "exp" },
    ],
  },
}
