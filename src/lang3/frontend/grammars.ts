import * as pt from "../../partech"

export const zero_or_more = pt.grammars.zero_or_more
export const one_or_more = pt.grammars.one_or_more
export const dashline = pt.grammars.dashline

export const $start = "exp"

const preserved = [
  "Equal",
  "same",
  "replace",
  "Absurd",
  "String",
  "Type",
  "Object",
]

export const identifier = {
  $pattern: ["identifier", `^(?!(${preserved.join("|")}))`],
}

export const exp = {
  "exp:var": [{ name: "identifier" }],
  "exp:pi": [
    '"("',
    { name: "identifier" },
    '":"',
    { arg_t: "exp" },
    '")"',
    '"-"',
    '">"',
    { ret_t: "exp" },
  ],
  "exp:arrow": ['"("', { arg_t: "exp" }, '")"', '"-"', '">"', { ret_t: "exp" }],
  "exp:fn": [
    '"("',
    { pattern: "pattern" },
    '")"',
    '"="',
    '">"',
    { body: "exp" },
  ],
  "exp:ap": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  "exp:cls": ['"{"', { sat: "sat" }, { scope: "scope" }, '"}"'],
  "exp:obj": ['"{"', { properties: "properties" }, '"}"'],
  "exp:field": [{ target: "head" }, '"."', { name: "identifier" }],
  "exp:method": [
    { target: "head" },
    '"."',
    { name: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  "exp:equal": [
    '"Equal"',
    '"("',
    { t: "exp" },
    '","',
    { from: "exp" },
    '","',
    { to: "exp" },
    '")"',
  ],
  "exp:same": ['"same"'],
  "exp:replace": [
    '"replace"',
    '"("',
    { target: "exp" },
    '","',
    { motive: "exp" },
    '","',
    { base: "exp" },
    '")"',
  ],
  "exp:absurd": ['"Absurd"'],
  "exp:absurd_ind": [
    '"Absurd"',
    '"."',
    '"ind"',
    '"("',
    { target: "exp" },
    '","',
    { motive: "exp" },
    '")"',
  ],
  "exp:str": ['"String"'],
  "exp:quote": [{ value: { $pattern: ["string"] } }],
  "exp:union": [
    '"{"',
    { head: "exp" },
    { tail: { $ap: ["zero_or_more", '"|"', "exp"] } },
    '"}"',
  ],
  "exp:type": ['"Type"'],
  "exp:object": ['"Object"'],
  "exp:begin": [
    '"@"',
    '"begin"',
    '"{"',
    { stmts: "stmts" },
    { ret: "exp" },
    '"}"',
  ],
  "exp:deduction": [
    '"{"',
    { deduction_entries: { $ap: ["one_or_more", "deduction_entry"] } },
    { deduction_args: { $ap: ["zero_or_more", "exp"] } },
    '"}"',
  ],
}

export const head = {
  "head:var": [{ name: "identifier" }],
  "head:ap": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  "head:field": [{ target: "head" }, '"."', { name: "identifier" }],
  "head:method": [
    { target: "head" },
    '"."',
    { name: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
}

export const pattern = {
  "pattern:v": [{ name: "identifier" }],
  "pattern:datatype": [
    { name: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "pattern", '")"'] } },
  ],
  "pattern:data": [
    { name: "identifier" },
    '"."',
    { tag: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "pattern", '")"'] } },
  ],
  "pattern:data_nullary": [
    { name: "identifier" },
    '"."',
    { tag: "identifier" },
  ],
}

export const deduction_entry = {
  "deduction_entry:deduction_entry": [{ t: "exp" }, "dashline", { exp: "exp" }],
}

export const tops = {
  "tops:tops": [{ tops: { $ap: ["zero_or_more", "top"] } }],
}

export const top = {
  "top:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "top:claim": [
    { claim: "identifier" },
    '":"',
    { t: "exp" },
    { define: "identifier" },
    '"="',
    { exp: "exp" },
  ],
  "top:show": ['"@"', '"show"', { exp: "exp" }],
  "top:datatype": [
    '"@"',
    '"datatype"',
    { name: "identifier" },
    '":"',
    { t: "exp" },
    '"{"',
    { sums: "sums" },
    '"}"',
  ],
}

export const sums = {
  "sums:sums": [{ sums: { $ap: ["zero_or_more", "sum_entry"] } }],
}

export const sum_entry = {
  "sum_entry:sum_entry": [{ tag: "identifier" }, '":"', { t: "exp" }],
}

export const stmts = {
  "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
}

export const stmt = {
  "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "stmt:claim": [
    { claim: "identifier" },
    '":"',
    { t: "exp" },
    { define: "identifier" },
    '"="',
    { exp: "exp" },
  ],
}

export const properties = {
  "properties:properties": [
    { properties: { $ap: ["zero_or_more", "property"] } },
  ],
}

export const property = {
  "property:property": [{ name: "identifier" }, '"="', { exp: "exp" }],
}

export const sat = {
  "sat:sat": [{ entries: { $ap: ["zero_or_more", "sat_entry"] } }],
}

export const sat_entry = {
  "sat_entry:sat_entry": [
    { name: "identifier" },
    '":"',
    { t: "exp" },
    '"="',
    { exp: "exp" },
  ],
}

export const scope = {
  "scope:scope": [{ entries: { $ap: ["one_or_more", "scope_entry"] } }],
}

export const scope_entry = {
  "scope_entry:scope_entry": [{ name: "identifier" }, '":"', { t: "exp" }],
}
