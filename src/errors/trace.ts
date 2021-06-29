export class Trace<T> {
  previous: Array<T> = Array.of()

  constructor(public message: string) {}

  trail(x: T): this {
    this.previous.push(x)
    return this
  }

  repr(formater: (x: T) => string): string {
    let s = ""
    s += this.message
    s += "\n"

    if (this.previous.length > 0) {
      s += "previous:\n"
      for (const x of this.previous) {
        s += `- ${formater(x)}\n`
      }
      s += "\n"
    }

    return s
  }
}
