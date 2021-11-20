import * as Exps from "../../exps"

interface FnOptions {
  name: string
  ret: {
    format(): string
    is_sequence: boolean
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
    const args = this.format_names().join(", ")
    const ret = this.format_ret()
    if (this.fn.ret.is_sequence) {
      return `(${args}) => { ${ret} }`
    } else {
      return `(${args}) => ${ret}`
    }
  }

  format_names(): Array<string> {
    const name = this.decorate_name
      ? this.decorate_name(this.fn.name)
      : this.fn.name
    if (this.fn.ret.fn_formater) {
      return [name, ...this.fn.ret.fn_formater.format_names()]
    } else {
      return [name]
    }
  }

  format_ret(): string {
    if (this.fn.ret.fn_formater) {
      return this.fn.ret.fn_formater.format_ret()
    } else {
      return this.fn.ret.format()
    }
  }
}
