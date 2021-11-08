import { BookReference } from "./book-reference"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
import ty from "@xieyuheng/ty"

export type BookConfigJson = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
  references?: Record<string, string>
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
