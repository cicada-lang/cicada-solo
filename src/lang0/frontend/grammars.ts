import * as pt from "../../partech"

export const identifier = { $pattern: ["identifier"] }

export const zero_or_more = pt.grammars.zero_or_more

export const one_or_more = pt.grammars.one_or_more

export const $start = "exp"

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
  "exp:suite": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
}

export const stmts = {
  "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
}

export const stmt = {
  "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "stmt:show": ['"@"', '"show"', { exp: "exp" }],
}
