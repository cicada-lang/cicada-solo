import Joi from "joi"

export type LibraryConfigJson = {
  name: string
  date: string
  src: string
}

export class LibraryConfig {
  name: string
  date: string
  src: string

  constructor(opts: { name: string; date: string; src: string }) {
    this.name = opts.name
    this.date = opts.date
    this.src = opts.src
  }

  static validate(data: any): LibraryConfigJson {
    const schema = Joi.object({
      name: Joi.string(),
      date: Joi.string(),
      src: Joi.string().optional(),
    }).unknown()

    const { value, error } = schema.validate(data, {
      presence: "required",
    })

    if (error) throw error

    return {
      name: value.name,
      date: value.date,
      src: value.src || "src",
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
