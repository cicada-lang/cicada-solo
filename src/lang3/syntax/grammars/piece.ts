export const piece = {
  $grammar: {
    "piece:piece": [
      '"@"',
      '"module"',
      { modpath: "modpath" },
      { tops: "tops" },
    ],
  },
}
