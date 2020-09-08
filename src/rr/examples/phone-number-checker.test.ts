import assert from "assert"
import * as rr from "../index"

// NOTE Enter your phone number.
//   The expected format is like: `###-###-####`

const sep = rr.group(/[-\/\.]/)
const three = rr.exactly(3, rr.digit)
const four = rr.exactly(4, rr.digit)

const re = rr.seq(rr.or(three, rr.seq("(", three, ")")), sep, three, sep, four)

const expected = /(\d{3}|\(\d{3}\))([-\/\.])\d{3}([-\/\.])\d{4}/

assert(re.source === expected.source)

const sentences = [
  "123-123-1234",
  "123-123-1234",
  "123.123.1234",
  "(123)-123-1234",
  "123/123/1234",
  "(123)/123.1234",
]

for (const sentence of sentences) assert(re.exec(sentence))
