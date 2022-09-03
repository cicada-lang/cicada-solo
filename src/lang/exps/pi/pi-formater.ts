interface PiOptions {
  name: string
  arg_t: {
    format(): string
  }
  ret_t: {
    free_names(bound_names: Set<string>): Set<string>
    format(): string
    pi_formater?: PiFormater
  }
}

export class PiFormater {
  pi: PiOptions
  decorate_typing?(typing: string): string

  constructor(
    pi: PiOptions,
    opts?: {
      decorate_typing?(typing: string): string
    },
  ) {
    this.pi = pi
    this.decorate_typing = opts?.decorate_typing
  }

  format(): string {
    const typings = this.format_typings().join(", ")
    const ret_t = this.format_ret_t()
    return `(${typings}) -> ${ret_t}`
  }

  private format_typings(): Array<string> {
    let typing = this.format_typing()
    if (this.decorate_typing) {
      typing = this.decorate_typing(typing)
    }

    if (this.pi.ret_t.pi_formater) {
      return [typing, ...this.pi.ret_t.pi_formater.format_typings()]
    } else {
      return [typing]
    }
  }

  private format_typing(): string {
    return this.pi.ret_t.free_names(new Set()).has(this.pi.name)
      ? `${this.pi.name}: ${this.pi.arg_t.format()}`
      : `${this.pi.arg_t.format()}`
  }

  private format_ret_t(): string {
    if (this.pi.ret_t.pi_formater) {
      return this.pi.ret_t.pi_formater.format_ret_t()
    } else {
      return this.pi.ret_t.format()
    }
  }
}
