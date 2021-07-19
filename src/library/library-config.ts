import Joi from "joi"

const joiSchema = Joi.object({
  name: Joi.string(),
  date: Joi.string(),
  src: Joi.string().optional(),
}).unknown()

export class LibraryConfig {
  name: string
  date: string
  src: string

  constructor(opts: { name: string; date: string; src: string }) {
    this.name = opts.name
    this.date = opts.date
    this.src = opts.src
  }

  static create(data: any): LibraryConfig {
    const { value, error } = joiSchema.validate(data, {
      presence: "required",
    })

    if (error) throw error

    return new LibraryConfig({
      name: value.name,
      date: value.date,
      src: value.src || "src",
    })
  }

  json(): {
    name: string
    date: string
    src: string
  } {
    return {
      name: this.name,
      date: this.date,
      src: this.src,
    }
  }
}
