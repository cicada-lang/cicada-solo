interface PiOptions {
  name: string
  arg_t: {
    format(): string
  }
  ret_t: {
    format(): string
    pi_formater?: PiFormater
  }
}

export class PiFormater {
  pi: PiOptions
  decorate_binding?(binding: string): string

  constructor(
    pi: PiOptions,
    opts?: {
      decorate_binding?(binding: string): string
    }
  ) {
    this.pi = pi
    this.decorate_binding = opts?.decorate_binding
  }

  format(): string {
    const args = this.format_args().join(", ")
    const ret_t = this.format_ret_t()
    return `(${args}) -> ${ret_t}`
  }

  format_args(): Array<string> {
    const binding = this.decorate_binding
      ? this.decorate_binding(`${this.pi.name}: ${this.pi.arg_t.format()}`)
      : `${this.pi.name}: ${this.pi.arg_t.format()}`

    if (this.pi.ret_t.pi_formater) {
      return [binding, ...this.pi.ret_t.pi_formater.format_args()]
    } else {
      return [binding]
    }
  }

  format_ret_t(): string {
    if (this.pi.ret_t.pi_formater) {
      return this.pi.ret_t.pi_formater.format_ret_t()
    } else {
      return this.pi.ret_t.format()
    }
  }
}
