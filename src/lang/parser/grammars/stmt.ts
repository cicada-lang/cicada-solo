export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:def_the": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:def_the_flower_bracket": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"{"',
      { exp: "exp" },
      '"}"',
    ],
    "stmt:def_fn": [
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
    "stmt:show_operator": [{ operator: "operator" }],
    "stmt:show_operand": [{ operand: "operand" }],
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
      { parent: "operator" },
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
    // "stmt:datatype": [
    //   '"datatype"',
    //   { name: "identifier" },
    //   '"("',
    //   { parameters: { $ap: ["zero_or_more", "import_entry"] } },
    //   '")"',
    //   '"{"',
    //   { entries: { $ap: ["zero_or_more", "import_entry"] } },
    //   '"}"',
    // ],
    // "stmt:datatype_with_indexes": [
    //   '"datatype"',
    //   { name: "identifier" },
    //   '"("',
    //   '")"',
    //   '"("',
    //   '")"',
    //   '"{"',
    //   { entries: { $ap: ["zero_or_more", "import_entry"] } },
    //   '"}"',
    // ],
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
