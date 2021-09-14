import ty from "@xieyuheng/ty"

export type LibraryConfigJson = {
  name: string
  date: string
  src: string
}

export class LibraryConfig {
  name: string
  date: string
  src: string

  constructor(opts: LibraryConfigJson) {
    this.name = opts.name
    this.date = opts.date
    this.src = opts.src
  }

  static validate(inupt: any): LibraryConfigJson {
    const schema = ty.object({
      name: ty.string(),
      date: ty.string(),
      src: ty.optional(ty.string()),
    })

    const data = schema.validate(inupt)

    return {
      name: data.name,
      date: data.date,
      src: data.src || "src",
    }
  }

  static create(data: any): LibraryConfig {
    return new LibraryConfig(LibraryConfig.validate(data))
  }

  json(): LibraryConfigJson {
    return {
      name: this.name,
      date: this.date,
      src: this.src,
    }
  }
}
