import Joi from "joi"

const joiSchema = Joi.object({
  name: Joi.string(),
  date: Joi.string(),
  shelves: Joi.array().items(Joi.string()),
}).unknown()

export class LibraryConfig {
  name: string
  date: string
  shelves: Array<string>

  rawConfig: any

  constructor(config: any) {
    const { value, error } = joiSchema.validate(config, {
      presence: "required",
    })

    if (error) throw error

    this.rawConfig = config

    this.name = value.name
    this.date = value.date
    this.shelves = value.shelves
  }

  json(): {
    name: string
    date: string
    shelves: Array<string>
  } {
    return {
      name: this.name,
      date: this.date,
      shelves: this.shelves,
    }
  }
}
