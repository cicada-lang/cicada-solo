import assert from "assert"
import * as rr from "../index"
import * as ut from "../../ut"

// NOTE
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

const word_space = rr.seq(rr.one_or_more(rr.word), rr.space)
const re = rr.add_flag(word_space, rr.flags.global)

const expected = /\w+\s/g
assert(re.source === expected.source)

const str = "fee  fi  fo  fum"
const results = str.match(re)
assert(ut.equal(results, ["fee ", "fi ", "fo "]))

{
  let results: null | RegExpExecArray = null
  console.log("// IMPRESSION `re.exec` will do side effect on `re.lastIndex`")
  do {
    results = re.exec(str)
    console.log("results   :", results)
    console.log("lastIndex :", re.lastIndex)
  } while (results)
}
