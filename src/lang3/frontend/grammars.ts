import * as pt from "../../partech"

export const zero_or_more = pt.grammars.zero_or_more
export const one_or_more = pt.grammars.one_or_more
export const dashline = pt.grammars.dashline

export const $start = "exp"

const preserved = ["Equal", "same", "replace", "Absurd", "String", "Type"]

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
    { name: "identifier" },
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
  "exp:fill": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"["', "exp", '"]"'] } },
  ],
  "exp:obj": ['"{"', { properties: "properties" }, '"}"'],
  "exp:dot": [{ target: "exp" }, '"."', { name: "identifier" }],
  "exp:method_call": [{ target: "exp" }, '"."', { name: "identifier" }],
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
  "exp:type": ['"Type"'],
  "exp:begin": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
  "exp:deduction": [
    '"{"',
    { deduction_entries: { $ap: ["one_or_more", "deduction_entry"] } },
    { deduction_args: { $ap: ["zero_or_more", "exp"] } },
    '"}"',
  ],
}

export const deduction_entry = {
  "deduction_entry:deduction_entry": [{ t: "exp" }, "dashline", { exp: "exp" }],
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
  "stmt:show": ['"@"', '"show"', { exp: "exp" }],
}

export const properties = {
  "properties:properties": [
    { properties: { $ap: ["one_or_more", "property"] } },
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
