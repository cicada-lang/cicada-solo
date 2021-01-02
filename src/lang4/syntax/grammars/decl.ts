export const decl = {
  $grammar: {
    "decl:define": [
      '"@"',
      '"claim"',
      { claimed: "identifier" },
      '"["',
      { pre: "jos" },
      '"-"',
      '">"',
      { post: "jos" },
      '"]"',
      '"@"',
      '"define"',
      { defined: "identifier" },
      { jojo: "jojo" },
    ],
    "decl:show": ['"@"', '"show"', { jojo: "jojo" }],
  },
}

export const decls = {
  $grammar: {
    "decls:decls": [{ decls: { $ap: ["zero_or_more", "decl"] } }],
  },
}
