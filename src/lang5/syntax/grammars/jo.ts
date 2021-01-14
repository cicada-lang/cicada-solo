export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ['"("', { name: "identifier" }, '")"'],
    "jo:jojo": [{ jojo: "jojo" }],
    "jo:execute": ['"!"'],
    "jo:str_lit": [{ value: { $pattern: ["string"] } }],
    "jo:sym_lit": ['"\'"', { value: "identifier" }],
    "jo:num_lit": [{ value: { $pattern: ["number"] } }],
  },
}

export const jos = {
  $grammar: {
    "jos:jos": [{ jos: { $ap: ["zero_or_more", "jo"] } }],
  },
}

export const jojo = {
  $grammar: {
    "jojo:jojo": ['"["', { jos: "jos" }, '"]"'],
  },
}
