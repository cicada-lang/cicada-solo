export const stmt = {
  $grammar: {
    "stmt:define": [
      { claimed_name: "identifier" },
      '":"',
      { pre: "jojo" },
      { post: "jojo" },
      { defined_name: "identifier" },
      '"="',
      { jojo: "jojo" },
    ],
    "stmt:show": ["@show", { jojo: "jojo" }],
  },
}
