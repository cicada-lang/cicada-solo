// NOTE
// Copy from: https://github.com/chalk/ansi-regex
//   can not import it, because it does not use commonjs module.

export function ansiRegex({ onlyFirst = false } = {}): RegExp {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|")

  return new RegExp(pattern, onlyFirst ? undefined : "g")
}

export function stripAnsi(str: string): string {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof str}\``)
  }

  return str.replace(ansiRegex(), "")
}
