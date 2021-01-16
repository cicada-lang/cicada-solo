export const stmt = {
  $grammar: {
    "stmt:define": [
      '"@"',
      '"define"',
      { defined: "identifier" },
      { jojo: "jojo" },
    ],
    "stmt:show": ['"@"', '"show"', { jojo: "jojo" }],
    "stmt:semantic_show": ['"@"', '"show"', { jojo: "jojo" }],
    "stmt:assert_equal": [
      '"@"',
      '"assert_equal"',
      { left: "jojo" },
      { right: "jojo" },
    ],
    "stmt:assert_not_equal": [
      '"@"',
      '"assert_not_equal"',
      { left: "jojo" },
      { right: "jojo" },
    ],
  },
}

export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}
