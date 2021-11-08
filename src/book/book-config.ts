import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type BookConfigJson = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
  references?: Record<string, string>
}

export class BookReference {
  tag: string

  constructor(opts: { tag: string }) {
    this.tag = opts.tag
  }

  static parse(input: string): BookReference {
    return {
      tag: input,
    }
  }

  static parseReferences(
    input: Record<string, string>
  ): Record<string, BookReference> {
    const references:  Record<string, BookReference> = {}
    for (const [key, value] of Object.entries(input)) {
      references[key] = this.parse(value)
    }

    return references
  }
}

export class BookConfig {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
  references: Record<string, BookReference>

  constructor(opts: BookConfigJson) {
    this.title = opts.title
    this.subtitle = opts.subtitle
    this.version = opts.version
    this.src = opts.src
    this.authors = opts.authors
    this.date = opts.date
    this.references = opts.references
      ? BookReference.parseReferences(opts.references)
      : {}
  }

  static schema = ty.object<BookConfigJson>({
    title: ty.string(),
    subtitle: ty.optional(ty.string()),
    version: ty.semver(),
    src: ty.string(),
    authors: ty.optional(ty.array(ty.string())),
    date: ty.optional(ty.string()),
    references: ty.optional(ty.dict(ty.string())),
  })

  static validate(input: any): BookConfigJson {
    return this.schema.validate(input)
  }

  static create(input: any): BookConfig {
    return new BookConfig(this.validate(input))
  }

  static fake(): BookConfig {
    return this.create({
      title: `<fake-book-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    })
  }
}
