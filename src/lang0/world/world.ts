import { Env } from "../env"
import { Value } from "../value"

export class World {
  env: Env
  output: string

  constructor(the?: { env?: Env; output?: string }) {
    this.env = the?.env || new Env()
    this.output = the?.output || ""
  }

  env_extend(name: string, value: Value): World {
    return new World({
      ...this,
      env: this.env.extend(name, value),
    })
  }

  output_append(str: string): World {
    return new World({
      ...this,
      output: this.output + str,
    })
  }
}
