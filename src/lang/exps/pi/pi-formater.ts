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
    const bindings = this.format_bindings().join(", ")
    const ret_t = this.format_ret_t()
    return `(${bindings}) -> ${ret_t}`
  }

  private format_bindings(): Array<string> {
    let binding = this.format_binding()
    if (this.decorate_binding) {
      binding = this.decorate_binding(binding)
    }

    if (this.pi.ret_t.pi_formater) {
      return [binding, ...this.pi.ret_t.pi_formater.format_bindings()]
    } else {
      return [binding]
    }
  }

  private format_binding(): string {
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
