export class BookReference {
  tag: string

  constructor(opts: { tag: string }) {
    this.tag = opts.tag
  }

  static parse(input: string): BookReference {
    return new BookReference({
      tag: input,
    })
  }

  static parseReferences(
    input: Record<string, string>
  ): Record<string, BookReference> {
    const references: Record<string, BookReference> = {}
    for (const [key, value] of Object.entries(input)) {
      references[key] = this.parse(value)
    }

    return references
  }

  format(): string {
    return this.tag
  }
}
