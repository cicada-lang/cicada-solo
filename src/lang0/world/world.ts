import { Env } from "../env"

export class World {
  env: Env
  output: string

  constructor(the?: { env?: Env; output?: string }) {
    this.env = the?.env || new Env()
    this.output = the?.output || ""
  }
}
