// line of more then one dashes

module.exports = {
  $start: "dashline",

  dashline: {
    "dashline:dashline": ['"-"', { $ap: ["one_or_more", '"-"'] }],
  },

  one_or_more: {
    $fn: [
      "x",
      {
        "one_or_more:one": [{ value: "x" }],
        "one_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["one_or_more", "x"] } },
        ],
      },
    ],
  },
}
