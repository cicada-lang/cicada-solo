// NOTE
//   docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes

export const anychar = /./
export const word = /\w/
export const non_word = /\W/
export const digit = /\d/
export const non_digit = /\D/
export const space = /\s/
export const non_space = /\S/
export const ascii_symbol = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/
export const inline_space = /[ \f\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/
