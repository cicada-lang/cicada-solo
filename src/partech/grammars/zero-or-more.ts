export const zero_or_more = {
  $fn: [
    "x",
    {
      $grammar: {
        "zero_or_more:zero": [],
        "zero_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["zero_or_more", "x"] } },
        ],
      },
    },
  ],
}
