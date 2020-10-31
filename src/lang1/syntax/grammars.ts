import * as pt from "../../partech"

export const zero_or_more = pt.grammars.zero_or_more
export const one_or_more = pt.grammars.one_or_more
export const dashline = pt.grammars.dashline

const preserved = ["zero", "add1", "rec"]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)

export const exp = {
  "exp:var": [{ name: "identifier" }],
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
  "exp:begin": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
  "exp:zero": ['"zero"'],
  "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
  "exp:number": [{ value: { $pattern: ["number"] } }],
  "exp:rec": [
    '"rec"',
    '"["',
    { t: "ty" },
    '"]"',
    '"("',
    { target: "exp" },
    '","',
    { base: "exp" },
    '","',
    { step: "exp" },
    '")"',
  ],
  "exp:deduction": [
    '"{"',
    { deduction_entries: { $ap: ["one_or_more", "deduction_entry"] } },
    { deduction_args: { $ap: ["zero_or_more", "exp"] } },
    '"}"',
  ],
}

export const deduction_entry = {
  "deduction_entry:deduction_entry": [{ t: "ty" }, "dashline", { exp: "exp" }],
}

export const ty = {
  "ty:nat": ['"Nat"'],
  "ty:arrow": ['"("', { arg_t: "ty" }, '")"', '"-"', '">"', { ret_t: "ty" }],
}

export const stmts = {
  "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
}

export const stmt = {
  "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "stmt:claim": [
    { claim: "identifier" },
    '":"',
    { t: "ty" },
    { define: "identifier" },
    '"="',
    { exp: "exp" },
  ],
  "stmt:show": ['"@"', '"show"', { exp: "exp" }],
}
