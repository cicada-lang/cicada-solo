import assert from "assert"
import * as rr from "../index"

// NOTE
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

const bs = rr.one_or_more(/b/)
const dbsd = rr.seq(/d/, rr.group(bs), /d/)
const re = rr.add_flag(dbsd, rr.flags.global)

const expected = /d(b+)d/g

assert(re.source === expected.source)

const results = re.exec("cdbbdbsbz")

assert(results && results.index === 1)
