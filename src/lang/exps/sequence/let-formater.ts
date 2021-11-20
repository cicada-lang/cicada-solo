import * as Exps from "../../exps"

interface LetOptions {
  name: string
  exp: {
    format(): string
  }
  ret: {
    format(): string
    let_formater?: LetFormater
  }
}

export class LetFormater {
  target: LetOptions

  constructor(target: LetOptions) {
    this.target = target
  }

  format(): string {
    const bindings = this.format_bindings().join("; ")
    const ret = this.format_ret()
    return `${bindings}; ${ret}`
  }

  format_bindings(): Array<string> {
    const binding = `${this.target.name} = ${this.target.exp.format()}`

    if (this.target.ret.let_formater) {
      return [binding, ...this.target.ret.let_formater.format_bindings()]
    } else {
      return [binding]
    }
  }

  format_ret(): string {
    if (this.target.ret.let_formater) {
      return this.target.ret.let_formater.format_ret()
    } else {
      return `return ${this.target.ret.format()}`
    }
  }
}
