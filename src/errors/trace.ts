export class Trace<T> extends Error {
  message: string
  previous: Array<T> = []

  constructor(message: string) {
    super()
    this.message = message
  }

  trail(x: T): this {
    this.previous.push(x)
    return this
  }

  repr(formater: (x: T) => string): string {
    let s = ""
    s += this.message
    s += "\n"

    if (this.previous.length > 0) {
      s += "\n"
      s += "previous:\n"
      for (const x of this.previous) {
        s += `- ${formater(x)}\n`
      }
    }

    return s
  }
}
