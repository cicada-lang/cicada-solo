import assert from "assert"
import * as rr from "../index"
import * as ut from "../../ut"

// NOTE
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes

const sentence = "A ticket to 大阪 costs ¥2000 👌."

{
  const emoji_presentation = /\p{Emoji_Presentation}/
  const re = rr.add_flag(emoji_presentation, rr.flags.global + rr.flags.unicode)
  assert(ut.equal(sentence.match(re), ["👌"]))
}

{
  const non_latin = rr.one_or_more(/\P{Script_Extensions=Latin}/)
  const re = rr.add_flag(non_latin, rr.flags.global + rr.flags.unicode)
  assert(ut.equal(sentence.match(re), [" ", " ", " 大阪 ", " ¥2000 👌."]))
}

{
  const currency_or_punctuation = rr.or(
    /\p{Currency_Symbol}/,
    /\p{Punctuation}/
  )
  const re = rr.add_flag(
    currency_or_punctuation,
    rr.flags.global + rr.flags.unicode
  )
  assert(ut.equal(sentence.match(re), ["¥", "."]))
}

{
  // NOTE General_Category

  // finding all the letters of a text
  let story = "It’s the Cheshire Cat: now I shall have somebody to talk to."
  // Most explicit form
  const letter = /\p{General_Category=Letter}/
  const re = rr.add_flag(letter, rr.flags.global + rr.flags.unicode)
  assert(story.match(re))
  assert(re.exec(story))
}

{
  // NOTE Script

  const mixed = "aεЛ汉漢"
  assert(ut.equal(mixed.match(/\p{Script=Latin}/gu), ["a"]))
  assert(ut.equal(mixed.match(/\p{Script=Greek}/gu), ["ε"]))
  assert(ut.equal(mixed.match(/\p{Script=Cyrillic}/gu), ["Л"]))
  assert(ut.equal(mixed.match(/\p{Script=Han}/gu), ["汉", "漢"]))
}

{
  // NOTE Unicode property escapes vs. character classes

  const non_english_text = "Приключения Алисы в Стране чудес"

  // Trying to use ranges to avoid \w limitations:
  const re = /([\u0000-\u0019\u0021-\uFFFF])+/gu
  // BMP goes through U+0000 to U+FFFF but space is U+0020
  assert(
    ut.equal(non_english_text.match(re), [
      "Приключения",
      "Алисы",
      "в",
      "Стране",
      "чудес",
    ])
  )

  // Using Unicode property escapes instead
  const upe = /\p{Letter}+/gu
  assert(
    ut.equal(non_english_text.match(upe), [
      "Приключения",
      "Алисы",
      "в",
      "Стране",
      "чудес",
    ])
  )
}

{
  // NOTE about chinese character

  const chinese_text = "山川壯麗，物產豐隆，炎黃世胄，東亞稱雄。"

  assert(
    ut.equal(chinese_text.match(/\p{Letter}+/gu), [
      "山川壯麗",
      "物產豐隆",
      "炎黃世胄",
      "東亞稱雄",
    ])
  )

  assert(
    ut.equal(chinese_text.match(/\p{Punctuation}+/gu), ["，", "，", "，", "。"])
  )
}
