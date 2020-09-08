import assert from "assert"
import * as rr from "../index"

const re = rr.seq(
  rr.group(rr.one_or_more(rr.word)),
  rr.space,
  rr.group(rr.one_or_more(rr.word))
)

const expected = /(\w+)\s(\w+)/

assert(re.source === expected.source)

const str = "John Smith"

const newstr = str.replace(re, "$2, $1")

assert(newstr === "Smith, John")
