import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export interface BookReference {
  host: string
  repo: string
  version: string
}

export type BookConfigJson = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
  references?: Record<string, BookReference>
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
    this.references = opts.references || {}
  }

  static schema = ty.object<BookConfigJson>({
    title: ty.string(),
    subtitle: ty.optional(ty.string()),
    version: ty.semver(),
    src: ty.string(),
    authors: ty.optional(ty.array(ty.string())),
    date: ty.optional(ty.string()),
    references: ty.optional(
      ty.dict(
        ty.object({
          host: ty.string(),
          repo: ty.string(),
          version: ty.string(),
        })
      )
    ),
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

  addReference(name: string, ref: BookReference): void {
    this.references[name] = ref
  }

  json(): BookConfigJson {
    return {
      title: this.title,
      subtitle: this.subtitle,
      version: this.version,
      authors: this.authors,
      date: this.date,
      src: this.src,
      references: this.references,
    }
  }
}
