export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:def": [
      '"@"',
      '"def"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:def_the": [
      '"@"',
      '"def"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:show": ['"@"', '"show"', { exp: "exp" }],
    "stmt:class": [
      '"@"',
      '"class"',
      { name: "identifier" },
      '"["',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"]"',
    ],
    "stmt:class_extends": [
      '"@"',
      '"class"',
      { name: "identifier" },
      '"@"',
      '"extends"',
      { parent_name: "identifier" },
      '"["',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"]"',
    ],
    "stmt:import": [
      '"@"',
      '"import"',
      { path: { $pattern: ["string"] } },
      '"{"',
      { entries: { $ap: ["zero_or_more", "import_entry"] } },
      '"}"',
    ],
  },
}

export const import_entry = {
  $grammar: {
    "import_entry:name": [{ name: "identifier" }, { $ap: ["optional", '","'] }],
    "import_entry:name_alias": [
      { name: "identifier" },
      '":"',
      { alias: "identifier" },
      { $ap: ["optional", '","'] },
    ],
  },
}
