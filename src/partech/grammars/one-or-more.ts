export const one_or_more = {
  $fn: [
    "x",
    {
      $grammar: {
        "one_or_more:one": [{ value: "x" }],
        "one_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["one_or_more", "x"] } },
        ],
      },
    },
  ],
}
