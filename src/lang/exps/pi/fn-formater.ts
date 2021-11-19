interface FnOptions {
  name: string
  ret: {
    format(): string
    fn_formater?: FnFormater
  }
}

export class FnFormater {
  fn: FnOptions
  decorate_name?(name: string): string

  constructor(
    fn: FnOptions,
    opts?: {
      decorate_name(name: string): string
    }
  ) {
    this.fn = fn
    this.decorate_name = opts?.decorate_name
  }

  format(): string {
    const args = this.fn_args_format().join(", ")
    const ret = this.fn_ret_format()
    return `(${args}) => { ${ret} }`
  }

  fn_args_format(): Array<string> {
    const name = this.decorate_name
      ? this.decorate_name(this.fn.name)
      : this.fn.name
    if (this.fn.ret.fn_formater) {
      return [name, ...this.fn.ret.fn_formater.fn_args_format()]
    } else {
      return [name]
    }
  }

  fn_ret_format(): string {
    if (this.fn.ret.fn_formater) {
      return this.fn.ret.fn_formater.fn_ret_format()
    } else {
      return this.fn.ret.format()
    }
  }
}
