import assert from "assert"
import * as rr from "../index"
import * as ut from "../../ut"

// NOTE
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers

{
  const ghost_speak = "booh boooooooh"
  const spooky = rr.seq(/b/, rr.at_least(3, /o/), /h/)
  const re = rr.add_flag(spooky, rr.flags.global)
  assert(ut.equal(ghost_speak.match(spooky), ["boooooooh"]))
}

{
  const modified_quote =
    "[He] ha[s] to go read this novel [Alice in Wonderland]."

  const non_greedy = rr.add_flag(
    rr.seq("[", rr.non_greedy(rr.zero_or_more(/./)), "]"),
    rr.flags.global
  )

  assert(
    ut.equal(modified_quote.match(non_greedy), [
      "[He]",
      "[s]",
      "[Alice in Wonderland]",
    ])
  )

  const greedy = rr.add_flag(
    rr.seq("[", rr.zero_or_more(/./), "]"),
    rr.flags.global
  )

  assert(
    ut.equal(modified_quote.match(greedy), [
      "[He] ha[s] to go read this novel [Alice in Wonderland]",
    ])
  )
}

{
  const xml = "<foo> <bar> new </bar> </foo>"

  const non_greedy = rr.add_flag(
    rr.seq(/</, rr.non_greedy(rr.zero_or_more(/./)), />/),
    rr.flags.global
  )

  assert(
    ut.equal(xml.match(non_greedy), ["<foo>", "<bar>", "</bar>", "</foo>"])
  )

  const greedy = rr.add_flag(
    rr.seq(/</, rr.zero_or_more(/./), />/),
    rr.flags.global
  )

  assert(ut.equal(xml.match(greedy), ["<foo> <bar> new </bar> </foo>"]))
}

{
  // NOTE Counting characters

  const single_letter_word = rr.add_flag(
    rr.seq(rr.boundary, rr.word, rr.boundary),
    rr.flags.global
  )

  const not_so_long_word = rr.add_flag(
    rr.seq(rr.boundary, rr.at_least_at_most(1, 6, rr.word), rr.boundary),
    rr.flags.global
  )

  const loooong_word = rr.add_flag(
    rr.seq(rr.boundary, rr.at_least(13, rr.word), rr.boundary),
    rr.flags.global
  )

  const sentence = "Why do I have to learn multiplication table?"

  assert(ut.equal(sentence.match(single_letter_word), ["I"]))

  assert(
    ut.equal(sentence.match(not_so_long_word), [
      "Why",
      "do",
      "I",
      "have",
      "to",
      "learn",
      "table",
    ])
  )

  assert(ut.equal(sentence.match(loooong_word), ["multiplication"]))
}

{
  // NOTE Optional character

  const british = "He asked his neighbour a favour."
  const american = "He asked his neighbor a favor."

  const ending = rr.add_flag(
    rr.seq(rr.one_or_more(rr.word), "o", rr.optional(/u/), "r"),
    rr.flags.global
  )

  assert(ut.equal(british.match(ending), ["neighbour", "favour"]))
  assert(ut.equal(american.match(ending), ["neighbor", "favor"]))
}
