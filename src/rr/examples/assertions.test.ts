import assert from "assert"
import * as rr from "../index"
import * as ut from "../../ut"

// NOTE
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions

{
  // NOTE Lookahead assertion
  const re = rr.add_flag(rr.lookahead(/First/, / test/), rr.flags.global)
  assert(ut.equal("First test".match(re), ["First"]))
  assert(ut.equal("First peach".match(re), null))
  assert(ut.equal("This is a First test in a year.".match(re), ["First"]))
  assert(ut.equal("This is a First peach in a month.".match(re), null))
}

{
  // NOTE Basic negative lookahead assertion
  //   matches a number only if it is not followed by a decimal point.
  const re = rr.add_flag(
    rr.negative_lookahead(rr.one_or_more(rr.digit), /\./),
    rr.flags.global
  )
  assert(ut.equal("3.141".match(re), ["141"]))
}

{
  {
    // NOTE preserved identifiers
    //   with global flag

    const re = rr.add_flag(
      rr.seq(
        rr.negative_lookahead(rr.beginning, rr.or("type", "let", "case")),
        rr.word
      ),
      rr.flags.global
    )

    assert(ut.equal("x".match(re), ["x"]))
    assert(ut.equal("y".match(re), ["y"]))

    assert(ut.equal("let".match(re), null))
    assert(ut.equal("type".match(re), null))
    assert(ut.equal("case".match(re), null))

    assert(ut.equal(re.exec("let"), null))
    assert(ut.equal(re.exec("type"), null))
    assert(ut.equal(re.exec("case"), null))
  }

  {
    const re = rr.seq(
      rr.negative_lookahead(rr.beginning, rr.or("type", "let", "case")),
      rr.word
    )

    {
      const result = "x".match(re)
      assert(ut.equal(result ? result[0] : null, "x"))
    }

    {
      const result = "y".match(re)
      assert(ut.equal(result ? result[0] : null, "y"))
    }

    assert(ut.equal("let".match(re), null))
    assert(ut.equal("type".match(re), null))
    assert(ut.equal("case".match(re), null))

    assert(ut.equal(re.exec("let"), null))
    assert(ut.equal(re.exec("type"), null))
    assert(ut.equal(re.exec("case"), null))
  }
}

{
  // NOTE Lookbehind assertion
  const oranges = ["ripe orange A ", "green orange B", "ripe orange C"]
  const re = rr.lookbehind("ripe ", "orange")
  const ripe_oranges = oranges.filter((fruit) => fruit.match(re))
  assert(ut.equal(ripe_oranges, ["ripe orange A ", "ripe orange C"]))
}
