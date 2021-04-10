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

  constructor(config: any) {
    const { value, error } = joiSchema.validate(config, {
      presence: "required",
    })

    if (error) throw error

    this.name = value.name
    this.date = value.date
    this.src = value.src || "src"
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
