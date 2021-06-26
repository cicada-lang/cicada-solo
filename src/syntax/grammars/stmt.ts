export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:def": ['"def"', { name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:def_the": [
      '"def"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:def_fn": [
      '"def"',
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"="',
      { ret: "exp" },
    ],
    "stmt:def_flower": [
      '"def"',
      { name: "identifier" },
      '"{"',
      { exp: "exp" },
      '"}"',
    ],
    "stmt:def_flower_the": [
      '"def"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"{"',
      { exp: "exp" },
      '"}"',
    ],
    "stmt:def_flower_fn": [
      '"def"',
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"{"',
      { ret: "exp" },
      '"}"',
    ],
    "stmt:show": [{ exp: "exp" }],
    "stmt:class": [
      '"class"',
      { name: "identifier" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "stmt:class_extends": [
      '"class"',
      { name: "identifier" },
      '"extends"',
      { parent: "elim" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "stmt:import": [
      '"import"',
      '"{"',
      { entries: { $ap: ["zero_or_more", "import_entry"] } },
      '"}"',
      '"from"',
      { path: { $pattern: ["string"] } },
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
