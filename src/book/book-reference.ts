export type BookReferenceJson = {
  tag: string
}

export class BookReference {
  tag: string

  constructor(opts: BookReferenceJson) {
    this.tag = opts.tag
  }

  static parse(spec: string): BookReference {
    // TODO `spec` only support literal `tag` for now.
    return new BookReference({
      tag: spec,
    })
  }

  static parseReferences(
    input: Record<string, string>
  ): Record<string, BookReference> {
    const references: Record<string, BookReference> = {}
    for (const [key, spec] of Object.entries(input)) {
      references[key] = this.parse(spec)
    }

    return references
  }

  format(): string {
    return this.tag
  }
}
