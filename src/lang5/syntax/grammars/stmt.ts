export const stmt = {
  $grammar: {
    "stmt:define": [
      '"@"',
      '"define"',
      { defined: "identifier" },
      { jojo: "jojo" },
    ],
    "stmt:show": ['"@"', '"show"', { jojo: "jojo" }],
  },
}

export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}
