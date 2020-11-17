export const piece = {
  $grammar: {
    "piece:mod": ['"@"', '"module"', { modpath: "modpath" }, { tops: "tops" }],
    "piece:repl": [{ tops: "tops" }],
  },
}
