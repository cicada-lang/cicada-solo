export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ["(", { name: "identifier" }, ")"],
    "jo:jojo": [{ jojo: "jojo" }],
    "jo:str": ['"String"'],
    "jo:quote": [{ value: { $pattern: ["string"] } }],
    "jo:type": ['"Type"'],
  },
}

export const jojo = {
  $grammar: {
    "jojo:jojo": ["[", { $ap: ["zero_or_more", "jo"] }, "]"],
  },
}
