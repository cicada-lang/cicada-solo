export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:let": ['"let"', { name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:let_the": [
      '"let"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:check": ['"check"', { exp: "exp" }, '":"', { t: "exp" }],
    "stmt:let_fn": [
      '"function"',
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
    ],
    "stmt:compute": ['"compute"', { exp: "exp" }],
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
    "stmt:datatype": [
      '"datatype"',
      { name: "identifier" },
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_fixed": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      { fixed: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_fixed_and_varied": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      { fixed: "simple_bindings" },
      '")"',
      '"("',
      { varied: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_varied": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      '")"',
      '"("',
      { varied: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
  },
}

export const import_entry = {
  $grammar: {
    "import_entry:name": [{ name: "identifier" }, { $ap: ["optional", '","'] }],
    "import_entry:name_alias": [
      { name: "identifier" },
      '"as"',
      { alias: "identifier" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const ctor = {
  $grammar: {
    "ctor:field": [{ name: "identifier" }, '":"', { t: "exp" }],
    "ctor:method": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
    ],
  },
}
